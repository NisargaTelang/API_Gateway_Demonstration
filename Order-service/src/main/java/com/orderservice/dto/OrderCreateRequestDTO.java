package com.orderservice.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequestDTO {
    private String productId;
    private String email;
    private String fullName;
    private String mobileNo;
    private String token;
    private String status;
    private String address;
}
