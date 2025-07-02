package luxuryride.service;


import luxuryride.entities.Payment;
import luxuryride.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

    @Service
    public class PaymentService {

        @Autowired
        private PaymentRepository paymentRepository;

        public Payment createPayment(Payment payment) {
            return paymentRepository.save(payment);
        }

        public List<Payment> getAllPayments() {
            return paymentRepository.findAll();
        }

        public Payment getPaymentById(Long id) {
            return paymentRepository.findById(id).orElse(null);
        }

        public Payment updatePayment(Long id, Payment updatedPayment) {
            Payment existing = paymentRepository.findById(id).orElse(null);
            if (existing != null) {
                existing.setAmount(updatedPayment.getAmount());
                existing.setPaymentDate(updatedPayment.getPaymentDate());
                existing.setMethod(updatedPayment.getMethod());
                existing.setPaymentType(updatedPayment.getPaymentType());
                existing.setClient(updatedPayment.getClient());
                return paymentRepository.save(existing);
            }
            return null;
        }



        public void deletePayment(Long id) {
            paymentRepository.deleteById(id);
        }
    }


