package luxuryride.service;

import luxuryride.entities.Car;
import luxuryride.entities.Reservation;
import luxuryride.repository.CarRepository;
import luxuryride.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    public List<Reservation> findAll() {
        return reservationRepo.findAll();
    }

    public Optional<Reservation> findById(Long id) {
        return reservationRepo.findById(id);
    }

    public List<Reservation> findByCustomerEmail(String email) {
        return reservationRepo.findByCustomerEmail(email);
    }

    public Reservation rentCar(Long carId,
                               String customerName,
                               String customerEmail,
                               LocalDate start,
                               LocalDate end) {

        if (start == null || end == null)
            throw new IllegalArgumentException("Start and end dates must be provided");
        if (start.isAfter(end))
            throw new IllegalArgumentException("Start date must be on or before end date");

        Car car = carRepo.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Car not found: " + carId));

        if (!car.isForRent())
            throw new IllegalArgumentException("Car is not offered for rent");

        if (!reservationRepo.findConflicts(carId, start, end).isEmpty())
            throw new IllegalArgumentException("Car already reserved for the selected dates");

        long days = ChronoUnit.DAYS.between(start, end) + 1;
        double total = days * car.getPrice();

        Reservation r = new Reservation();
        r.setCar(car);
        r.setCustomerName(customerName);
        r.setCustomerEmail(customerEmail);
        r.setStartDate(start);
        r.setEndDate(end);
        r.setTotalPrice(total);
        r.setStatus(Reservation.Status.PENDING);

        return reservationRepo.save(r);
    }

    public Optional<Reservation> updateReservation(Long id, Reservation u) {
        return reservationRepo.findById(id).map(r -> {
            r.setStartDate(u.getStartDate());
            r.setEndDate(u.getEndDate());
            r.setTotalPrice(u.getTotalPrice());
            r.setStatus(u.getStatus());
            return reservationRepo.save(r);
        });
    }

    public boolean deleteReservation(Long id) {
        if (!reservationRepo.existsById(id)) return false;
        reservationRepo.deleteById(id);
        return true;
    }
}
