package luxuryride.entities;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* basic info */
    private String brand;          // e.g. BMW
    private String model;          // e.g. X5
    private String type;           // Sedan, SUV …

    /* commercial info */
    private double price;
    private boolean available;
    private boolean forRent;
    private boolean forSale;

    /* extra details */
    private Integer year;
    private Integer mileage;
    private String fuel;           // Gasoline, Diesel, Electric …
    private String image;          // URL or path

    @Column(columnDefinition = "TEXT")
    private String description;

    public Car() {}

    public Car(Long id, String brand, String model, String type,
               double price, boolean available, boolean forRent, boolean forSale,
               Integer year, Integer mileage, String fuel, String image,
               String description) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.type = type;
        this.price = price;
        this.available = available;
        this.forRent = forRent;
        this.forSale = forSale;
        this.year = year;
        this.mileage = mileage;
        this.fuel = fuel;
        this.image = image;
        this.description = description;
    }

    /* getters & setters */

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public boolean isForRent() { return forRent; }
    public void setForRent(boolean forRent) { this.forRent = forRent; }

    public boolean isForSale() { return forSale; }
    public void setForSale(boolean forSale) { this.forSale = forSale; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    /* equals / hashCode on id */

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Car)) return false;
        return Objects.equals(id, ((Car) o).id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
