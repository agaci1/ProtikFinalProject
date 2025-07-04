package luxuryride.service;

import org.springframework.stereotype.Service;
import luxuryride.entities.Car;
import luxuryride.entities.Purchase;
import luxuryride.repository.CarRepository;
import luxuryride.repository.PurchaseRepository;

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
        this.carRepo      = carRepo;
    }

    /** Fetch all purchases */
    public List<Purchase> findAll() {
        return purchaseRepo.findAll();
    }

    /** Fetch one purchase by ID */
    public Optional<Purchase> findById(Long id) {
        return purchaseRepo.findById(id);
    }

    /**
     * Buy a car:
     *  - Checks existence & forSale flag
     *  - Uses Car.purchasePrice as the amount
     *  - Marks the car unavailable and no longer forSale
     *  - Saves a new Purchase with today's date
     */
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

        // mark car sold/unavailable
        car.setAvailable(false);
        car.setForSale(false);
        carRepo.save(car);

        return purchaseRepo.save(p);
    }

    /** Delete a purchase; returns true if existed */
    public boolean deletePurchase(Long id) {
        if (!purchaseRepo.existsById(id)) {
            return false;
        }
        purchaseRepo.deleteById(id);
        return true;
    }
}
