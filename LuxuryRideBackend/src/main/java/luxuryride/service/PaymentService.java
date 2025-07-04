package luxuryride.service;

import luxuryride.entities.Payment;
import luxuryride.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    public Payment createPayment(Payment p)        { return repo.save(p); }
    public List<Payment> getAllPayments()          { return repo.findAll(); }
    public Payment getPaymentById(Long id)         { return repo.findById(id).orElse(null); }
    public void deletePayment(Long id)             { repo.deleteById(id); }
}
