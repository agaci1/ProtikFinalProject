package luxuryride.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private String plates;
    private double price;
    private boolean available;
    private boolean forRent;
    private boolean forSale;

    @Column(columnDefinition = "TEXT")
    private String description;
}
