package com.orderservice.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import com.orderservice.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {

    private String orderId;
    private String productId;
    private String productName;
    private BigDecimal priceSnapshot;
    private Integer quantity;

    private String email;
    private String fullName;
    private String mobileNo;
    private String address;

    private OrderStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String imageUrl;
}
