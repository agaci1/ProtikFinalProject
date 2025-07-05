package luxuryride.entities;

import jakarta.persistence.*;
import lombok.*;
import luxuryride.enums.PaymantType;
import luxuryride.enums.PaymentMethod;

import java.time.LocalDate;
@Data

@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private LocalDate paymentDate;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymantType paymantType;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;


    public Payment(PaymantType paymantType) {
        this.paymantType = paymantType;
    }

    public Payment(PaymentMethod method) {
        this.method = method;
    }

    public PaymantType getPaymantType() {
        return paymantType;
    }

    public void setPaymantType(PaymantType paymantType) {
        this.paymantType = paymantType;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }
}
