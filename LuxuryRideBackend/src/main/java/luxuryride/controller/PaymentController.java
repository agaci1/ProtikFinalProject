package luxuryride.controller;

import luxuryride.entities.Payment;
import luxuryride.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Payment> getAll() {
        return service.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> get(@PathVariable Long id) {
        Payment p = service.getPaymentById(id);
        return (p != null) ? ResponseEntity.ok(p)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Payment create(@RequestBody Payment payment) {
        return service.createPayment(payment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deletePayment(id);
    }
}
