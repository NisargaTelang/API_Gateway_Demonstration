package com.orderservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderservice.dto.AdminOrderDTO;
import com.orderservice.dto.OrderCreateRequestDTO;
import com.orderservice.dto.OrderCreationDTO;
import com.orderservice.dto.OrderResponseDTO;
import com.orderservice.dto.OrderStatusUpdateRequestDTO;
import com.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@CrossOrigin
@RequiredArgsConstructor
public class OrderController {

	@Autowired
	private OrderService orderService;

	// CREATE ORDER
	@PostMapping
	public ResponseEntity<OrderCreationDTO> createOrder(@RequestBody OrderCreateRequestDTO request) {

		return ResponseEntity.ok(orderService.createOrder(request));
	}

    @GetMapping("/{email}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByEmail(@PathVariable String email) {
        List<OrderResponseDTO> orders = orderService.getOrdersByEmail(email);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@RequestBody OrderStatusUpdateRequestDTO request) {
        OrderResponseDTO updatedOrder = orderService.updateOrderStatus(request);
        return ResponseEntity.ok(updatedOrder);
    }
    
 // OrderController.java
    @GetMapping("/admin/all-orders")
    public ResponseEntity<List<AdminOrderDTO>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    
 

}
