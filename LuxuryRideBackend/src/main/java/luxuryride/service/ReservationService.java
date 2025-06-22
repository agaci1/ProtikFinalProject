package luxuryride.service;

import org.springframework.stereotype.Service;
import luxuryride.entities.Car;
import luxuryride.entities.Reservation;
import luxuryride.repository.CarRepository;
import luxuryride.repository.ReservationRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepo;
    private final CarRepository carRepo;

    public ReservationService(ReservationRepository reservationRepo,
                              CarRepository carRepo) {
        this.reservationRepo = reservationRepo;
        this.carRepo = carRepo;
    }

    /** Fetch all reservations */
    public List<Reservation> findAll() {
        return reservationRepo.findAll();
    }

    /** Fetch one reservation by ID */
    public Optional<Reservation> findById(Long id) {
        return reservationRepo.findById(id);
    }

    /**
     * Rent a car:
     *  - Checks existence & availability
     *  - Calculates totalPrice
     *  - Marks the car unavailable
     *  - Saves the new Reservation with status PENDING
     */
    public Reservation rentCar(Long carId,
                               String customerName,
                               String customerEmail,
                               LocalDate start,
                               LocalDate end) {
        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found: " + carId));

        if (!car.isAvailable()) {
            throw new IllegalArgumentException("Car is not available");
        }

        long days = end.toEpochDay() - start.toEpochDay() + 1;
        double total = days * car.getPrice();  // or getRentalPricePerDay()

        // create and populate
        Reservation r = new Reservation();
        r.setCar(car);
        r.setCustomerName(customerName);
        r.setCustomerEmail(customerEmail);
        r.setStartDate(start);
        r.setEndDate(end);
        r.setTotalPrice(total);
        r.setStatus(Reservation.Status.PENDING);

        car.setAvailable(false);
        carRepo.save(car);

        return reservationRepo.save(r);
    }

    /**
     * Update only the updatable fields of an existing reservation.
     */
    public Optional<Reservation> updateReservation(Long id, Reservation updated) {
        return reservationRepo.findById(id).map(r -> {
            r.setStartDate(updated.getStartDate());
            r.setEndDate(updated.getEndDate());
            r.setTotalPrice(updated.getTotalPrice());
            r.setStatus(updated.getStatus());
            return reservationRepo.save(r);
        });
    }

    /**
     * Delete a reservation.
     * @return true if deleted, false if not found.
     */
    public boolean deleteReservation(Long id) {
        if (!reservationRepo.existsById(id)) {
            return false;
        }
        reservationRepo.deleteById(id);
        return true;
    }
}
