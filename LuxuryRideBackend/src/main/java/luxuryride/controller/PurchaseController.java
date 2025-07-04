package luxuryride.controller;

import luxuryride.dto.PurchasePost;
import luxuryride.entities.Purchase;
import luxuryride.entities.Reservation;
import luxuryride.service.PurchaseService;
import luxuryride.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:3000")
public class PurchaseController {

    private final PurchaseService     purchaseService;
    private final ReservationService  reservationService;

    public PurchaseController(PurchaseService purchaseService,
                              ReservationService reservationService) {
        this.purchaseService    = purchaseService;
        this.reservationService = reservationService;
        System.out.println("✅ PurchaseController is active");
    }

    /* ─────────── basic CRUD ─────────── */

    @GetMapping
    public List<Purchase> getAllPurchases() {
        return purchaseService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> get(@PathVariable Long id) {
        return purchaseService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/buy")
    public Purchase buy(@RequestBody PurchasePost body) {
        return purchaseService.buyCar(
                body.carId,
                body.customerName,
                body.customerEmail,
                body.paymentMethod
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return purchaseService.deletePurchase(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    /* ─────────── history endpoints ─────────── */

    /** ① Purchases only */
    @GetMapping("/history/purchases/{email}")
    public List<Purchase> purchasesByEmail(@PathVariable String email) {
        return purchaseService.findByCustomerEmail(email.trim().toLowerCase());
    }

    /** ② FULL history (purchases + reservations) */
    @GetMapping("/history/{email}")
    public Map<String, Object> fullHistory(@PathVariable String email) {
        String key = email.trim().toLowerCase();
        Map<String, Object> out = new HashMap<>();
        out.put("purchases"   , purchaseService.findByCustomerEmail(key));
        out.put("reservations", reservationService.findByCustomerEmail(key));
        return out;
    }
}
