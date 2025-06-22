package luxuryride.entities;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "cars")
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

    /** Default constructor for JPA **/
    public Car() { }

    /** All-args constructor **/
    public Car(Long id,
               String brand,
               String model,
               String plates,
               double price,
               boolean available,
               boolean forRent,
               boolean forSale,
               String description) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.plates = plates;
        this.price = price;
        this.available = available;
        this.forRent = forRent;
        this.forSale = forSale;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getPlates() { return plates; }
    public void setPlates(String plates) { this.plates = plates; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public boolean isForRent() { return forRent; }
    public void setForRent(boolean forRent) { this.forRent = forRent; }

    public boolean isForSale() { return forSale; }
    public void setForSale(boolean forSale) { this.forSale = forSale; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // equals & hashCode (based on id)

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Car)) return false;
        Car car = (Car) o;
        return Objects.equals(id, car.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    // toString

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", brand='" + brand + '\'' +
                ", model='" + model + '\'' +
                ", plates='" + plates + '\'' +
                ", price=" + price +
                ", available=" + available +
                ", forRent=" + forRent +
                ", forSale=" + forSale +
                ", description='" + description + '\'' +
                '}';
    }
}
