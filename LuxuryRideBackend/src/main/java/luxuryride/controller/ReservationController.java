// src/main/java/luxuryride/controller/ReservationController.java
package luxuryride.controller;

import luxuryride.entities.Reservation;
import luxuryride.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Controller for reservation CRUD + dedicated rent endpoint.
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    /** GET  /api/reservations → all reservations */
    @GetMapping
    public List<Reservation> getAll() {
        return service.findAll();
    }

    /** GET  /api/reservations/{id} → one reservation */
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getOne(@PathVariable Long id) {
        Optional<Reservation> opt = service.findById(id);
        return opt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/reservations/rent
     * JSON body:
     * {
     *   "carId": 1,
     *   "customerName": "Alice",
     *   "customerEmail": "alice@example.com",
     *   "startDate": "2025-07-01",
     *   "endDate": "2025-07-05"
     * }
     */
    @PostMapping("/rent")
    public ResponseEntity<Reservation> rentCar(@RequestBody RentRequest dto) {
        try {
            Reservation r = service.rentCar(
                    dto.getCarId(),
                    dto.getCustomerName(),
                    dto.getCustomerEmail(),
                    dto.getStartDate(),
                    dto.getEndDate()
            );
            return ResponseEntity.ok(r);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/reservations/{id}
     * Expects full Reservation JSON for updatable fields.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(
            @PathVariable Long id,
            @RequestBody Reservation updated
    ) {
        Optional<Reservation> opt = service.updateReservation(id, updated);
        return opt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/reservations/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.deleteReservation(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ----- DTO for rentCar -----
    public static class RentRequest {
        private Long carId;
        private String customerName;
        private String customerEmail;
        private LocalDate startDate;
        private LocalDate endDate;

        // getters & setters
        public Long getCarId() { return carId; }
        public void setCarId(Long carId) { this.carId = carId; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    }
}
