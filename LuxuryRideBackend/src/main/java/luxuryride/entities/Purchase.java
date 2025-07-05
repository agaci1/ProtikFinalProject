package luxuryride.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ← Associate each purchase with a Car
    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    private String customerName;
    private String customerEmail;
    private LocalDate purchaseDate;
    private Double amount;
    private String paymentMethod;

    public Purchase() {}

    public Purchase(Long id, Car car, String customerName, String customerEmail,
                    LocalDate purchaseDate, Double amount, String paymentMethod) {
        this.id = id;
        this.car = car;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.purchaseDate = purchaseDate;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Car getCar() {
        return car;
    }
    public void setCar(Car car) {
        this.car = car;
    }

    public String getCustomerName() {
        return customerName;
    }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }
    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Double getAmount() {
        return amount;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Purchase)) return false;
        Purchase that = (Purchase) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Purchase{" +
                "id=" + id +
                ", car=" + car +
                ", customerName='" + customerName + '\'' +
                ", customerEmail='" + customerEmail + '\'' +
                ", purchaseDate=" + purchaseDate +
                ", amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                '}';
    }
}
