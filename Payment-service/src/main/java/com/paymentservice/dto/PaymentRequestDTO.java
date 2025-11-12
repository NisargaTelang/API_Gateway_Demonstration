package com.paymentservice.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String orderId;
//    private String token; // JWT from frontend
}
