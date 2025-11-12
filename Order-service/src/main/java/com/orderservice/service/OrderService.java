package com.orderservice.service;

import java.util.List;

import com.orderservice.dto.AdminOrderDTO;
import com.orderservice.dto.OrderCreateRequestDTO;
import com.orderservice.dto.OrderCreationDTO;
import com.orderservice.dto.OrderResponseDTO;
import com.orderservice.dto.OrderStatusUpdateRequestDTO;

public interface OrderService {

	OrderCreationDTO createOrder(OrderCreateRequestDTO request);
	
	List<OrderResponseDTO> getOrdersByEmail(String email);
	
    OrderResponseDTO updateOrderStatus(OrderStatusUpdateRequestDTO request);

    List<AdminOrderDTO> getAllOrders();



//    OrderResponse updateOrder(UUID orderId, OrderRequest request);
//
//    void deleteOrder(UUID orderId);
//
//    OrderResponse getOrderById(UUID orderId);
//
//    List<OrderResponse> getOrdersByCustomer(String customerId);
//
//    List<OrderResponse> getAllOrders();
//
//    // this will be called by PaymentService after payment success
//    OrderResponse markOrderAsPaid(UUID orderId);
//
//    // OPTIONAL later:
//    void cancelOrder(UUID orderId);
//
//	OrderResponse getOrder(UUID orderId);

}
