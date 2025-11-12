package com.paymentservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderResponseDTO {
    private String orderId;
    private String productId;
    private String productName;
    private BigDecimal priceSnapshot;
    private String email;
    private String fullName;
    private String mobileNo;
    private String address;
    private String status;
}
