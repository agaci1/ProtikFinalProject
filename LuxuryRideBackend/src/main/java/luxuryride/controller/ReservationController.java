package luxuryride.controller;

import luxuryride.dto.ReservationPost;
import luxuryride.entities.Reservation;
import luxuryride.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reservation> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> get(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reservation rent(@RequestBody ReservationPost body) {
        return service.rentCar(
                body.carId,
                body.customerName,
                body.customerEmail,
                body.startDate,
                body.endDate
        );
    }

    @GetMapping("/history/{email}")
    public List<Reservation> getByEmail(@PathVariable String email) {
        return service.findByCustomerEmail(email);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(@PathVariable Long id,
                                              @RequestBody Reservation updated) {
        return service.updateReservation(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.deleteReservation(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
