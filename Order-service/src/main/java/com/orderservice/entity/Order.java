package com.orderservice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.orderservice.enums.OrderStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor @Builder
public class Order {

    @Id
    @Column(length = 36)
    private String id; // store UUID as String

    @Column(nullable = false, length = 36)
    private String productId;
    
    @Column(nullable = true)
    private String productName;


    @Column(nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 15)
    private String mobileNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status; // PENDING, etc.

    // Optional: capture address later (null for now)
    @Column(columnDefinition = "TEXT")
    private String address;

    // Optional snapshot fields (enable when needed)
     @Column(precision = 12, scale = 2)
     private BigDecimal priceSnapshot;
     private Integer quantity;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
