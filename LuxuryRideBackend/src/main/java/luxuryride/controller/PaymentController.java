package luxuryride.controller;

import luxuryride.entities.Payment;
import luxuryride.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

       @Autowired
        private PaymentService paymentService;


        @PostMapping
        public Payment createPayment(@RequestBody Payment payment) {
            return paymentService.createPayment(payment);
        }


        @GetMapping
        public List<Payment> getAllPayments() {
            return paymentService.getAllPayments();
        }


        @GetMapping("/{id}")
        public Payment getPaymentById(@PathVariable Long id) {
            return paymentService.getPaymentById(id);
        }


        @PutMapping("/{id}")
        public Payment updatePayment(@PathVariable Long id, @RequestBody Payment updatedPayment) {
            return paymentService.updatePayment(id, updatedPayment);
        }

        @DeleteMapping("/{id}")
        public void deletePayment(@PathVariable Long id) {
            paymentService.deletePayment(id);
        }
    }

