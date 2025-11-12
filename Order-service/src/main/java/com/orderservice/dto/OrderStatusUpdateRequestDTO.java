package com.orderservice.dto;

import com.orderservice.enums.OrderStatus;
import lombok.Data;

@Data
public class OrderStatusUpdateRequestDTO {
    private String orderId;
    private OrderStatus status;
}
