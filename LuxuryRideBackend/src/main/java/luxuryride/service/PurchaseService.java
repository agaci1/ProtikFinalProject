package luxuryride.service;

import luxuryride.entities.Car;
import luxuryride.entities.Purchase;
import luxuryride.repository.CarRepository;
import luxuryride.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepo;
    private final CarRepository carRepo;

    public PurchaseService(PurchaseRepository purchaseRepo,
                           CarRepository carRepo) {
        this.purchaseRepo = purchaseRepo;
        this.carRepo = carRepo;
    }

    public List<Purchase> findAll() {
        return purchaseRepo.findAll();
    }

    public Optional<Purchase> findById(Long id) {
        return purchaseRepo.findById(id);
    }

    public List<Purchase> findByCustomerEmail(String email) {
        return purchaseRepo.findByCustomerEmail(email);
    }

    public Purchase buyCar(Long carId,
                           String customerName,
                           String customerEmail,
                           String paymentMethod) {

        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found: " + carId));

        if (!car.isForSale()) {
            throw new IllegalArgumentException("Car is not for sale");
        }

        Purchase p = new Purchase();
        p.setCar(car);
        p.setCustomerName(customerName);
        p.setCustomerEmail(customerEmail);
        p.setPurchaseDate(LocalDate.now());
        p.setAmount(car.getPrice());
        p.setPaymentMethod(paymentMethod);

        // Mark car as unavailable instead of deleting it
        car.setAvailable(false);
        carRepo.save(car);

        return purchaseRepo.save(p);
    }

    public boolean deletePurchase(Long id) {
        if (!purchaseRepo.existsById(id)) return false;
        purchaseRepo.deleteById(id);
        return true;
    }
}
