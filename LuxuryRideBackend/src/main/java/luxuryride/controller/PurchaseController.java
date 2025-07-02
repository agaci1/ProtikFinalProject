// src/main/java/luxuryride/controller/PurchaseController.java
package luxuryride.controller;

import luxuryride.entities.Purchase;
import luxuryride.service.PurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for purchase CRUD + dedicated buy endpoint.
 */
@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;

    public PurchaseController(PurchaseService service) {
        this.service = service;
    }

    /** GET /api/purchases → all purchases */
    @GetMapping
    public List<Purchase> getAll() {
        return service.findAll();
    }

    /** GET /api/purchases/{id} → one purchase */
    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getOne(@PathVariable Long id) {
        Optional<Purchase> opt = service.findById(id);
        return opt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/purchases/buy
     * JSON body:
     * {
     *   "carId": 1,
     *   "customerName": "Alice",
     *   "customerEmail": "alice@example.com",
     *   "paymentMethod": "Credit Card"
     * }
     */
    @PostMapping("/buy")
    public ResponseEntity<Purchase> buyCar(@RequestBody BuyRequest dto) {
        try {
            Purchase p = service.buyCar(
                    dto.getCarId(),
                    dto.getCustomerName(),
                    dto.getCustomerEmail(),
                    dto.getPaymentMethod()
            );
            return ResponseEntity.ok(p);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    /** DELETE /api/purchases/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.deletePurchase(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /** DTO for the /buy endpoint */
    public static class BuyRequest {
        private Long carId;
        private String customerName;
        private String customerEmail;
        private String paymentMethod;

        // Getters & setters
        public Long getCarId() { return carId; }
        public void setCarId(Long carId) { this.carId = carId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }
}
