package com.paymentservice.dto;

import com.paymentservice.enums.OrderStatus;

import lombok.Data;

@Data
public class OrderStatusUpdateRequestDTO {
    private String orderId;
    private OrderStatus status;
}



