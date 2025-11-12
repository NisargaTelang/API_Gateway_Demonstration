package com.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String orderId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 20)
    private String status; // SUCCESS / FAILED / PENDING

    private String pdfPath;

    @Column(nullable = false)
    private Instant createdAt;

    private String customerEmail;
}
