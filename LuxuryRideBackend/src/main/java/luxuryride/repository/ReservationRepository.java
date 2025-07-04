package luxuryride.repository;

import luxuryride.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.car.id = :carId AND " +
            "(r.startDate <= :end AND r.endDate >= :start)")
    List<Reservation> findConflicts(Long carId, LocalDate start, LocalDate end);

    List<Reservation> findByCustomerEmail(String email);
}
