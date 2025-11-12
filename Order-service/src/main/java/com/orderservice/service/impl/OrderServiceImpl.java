package com.orderservice.service.impl;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import com.orderservice.dto.AdminOrderDTO;
import com.orderservice.dto.OrderCreateRequestDTO;
import com.orderservice.dto.OrderCreationDTO;
import com.orderservice.dto.OrderResponseDTO;
import com.orderservice.dto.OrderStatusUpdateRequestDTO;
import com.orderservice.dto.PaymentResponseDTO;
import com.orderservice.dto.ProductDTO;
import com.orderservice.entity.Order;
import com.orderservice.enums.OrderStatus;
import com.orderservice.repository.OrderRepository;
import com.orderservice.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private WebClient webClient;

	@Value("${product.service.base-url}")
	private String productBaseUrl;
	
	@Value("${payment.service.base-url}")
	private String paymentBaseUrl;

	@Override
	public OrderCreationDTO createOrder(OrderCreateRequestDTO request) {
	    try {
	        // ✅ Step 1: Validate product
	        String productServiceUrl = productBaseUrl + "/" + request.getProductId();
	        ProductDTO product =
	                restTemplate.getForObject(productServiceUrl, ProductDTO.class);

	        if (product == null) {
	            throw new RuntimeException("Product not found");
	        }

	        // ✅ Step 2: Generate Order ID
	        String orderId = UUID.randomUUID().toString();

	        // ✅ Step 3: Build Order entity
	        Order order = Order.builder()
	                .id(orderId)
	                .productId(request.getProductId())
	                .productName(product.getName())
	                .createdAt(LocalDateTime.now())
	                .updatedAt(LocalDateTime.now())
	                .email(request.getEmail())
	                .fullName(request.getFullName())
	                .mobileNo(request.getMobileNo())
	                .status(OrderStatus.valueOf(request.getStatus()))
	                .address(request.getAddress())
	                .priceSnapshot(product.getPrice())
	                .quantity(1)
	                .build();

	        // ✅ Step 4: Save order
	        orderRepository.save(order);

	        // ✅ Step 5: Return response with orderId
	        return OrderCreationDTO.builder()
	                .orderId(orderId)
	                .status(order.getStatus().name())
	                .message("Order created successfully")
	                .build();

	    } catch (Exception e) {
	        throw new RuntimeException("Failed to create order: " + e.getMessage());
	    }
	}


	

    @Override
    public List<OrderResponseDTO> getOrdersByEmail(String email) {
        List<Order> orders = orderRepository.findByEmail(email);

        // ✅ For each order, fetch product details for richer response
        return orders.stream().map(order -> {
            OrderResponseDTO dto = modelMapper.map(order, OrderResponseDTO.class);
            dto.setOrderId(order.getId());

            try {
                String productServiceUrl = productBaseUrl +"/" + order.getProductId();
                ProductDTO product = restTemplate.getForObject(productServiceUrl, ProductDTO.class);
                if (product != null) {
                    dto.setProductName(product.getName());
                    dto.setPriceSnapshot(product.getPrice());
                    dto.setImageUrl(product.getImageUrl());
                }
            } catch (Exception e) {
            	System.out.println(e.toString());
                dto.setProductName("Product info unavailable");
            }

            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public OrderResponseDTO updateOrderStatus(OrderStatusUpdateRequestDTO request) {
        Optional<Order> optionalOrder = orderRepository.findById(request.getOrderId());
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found with ID: " + request.getOrderId());
        }

        Order order = optionalOrder.get();
        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);


        return modelMapper.map(order, OrderResponseDTO.class);
    }
    
    @Override
    public List<AdminOrderDTO> getAllOrders() {

        List<Order> orders = orderRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .toList();

        return orders.stream().map(order -> {

            // ✅ Step 1: Map Order → AdminOrderDTO
            AdminOrderDTO dto = modelMapper.map(order, AdminOrderDTO.class);

            dto.setOrderId(order.getId()); // Because entity uses "id"

            // ✅ Step 2: Fetch product details from Product Service
            try {
                String productUrl = productBaseUrl + "/" + order.getProductId();
                ProductDTO product = restTemplate.getForObject(productUrl, ProductDTO.class);
                System.out.println(product);
                if (product != null) {
                    dto.setProductName(product.getName());
                    dto.setImageUrl(product.getImageUrl());
                    dto.setPriceSnapshot(product.getPrice());
                }
            } catch (Exception e) {
                System.out.println("⚠️ Product fetch failed for: " + order.getProductId());
            }

            // ✅ Step 3: Fetch payment details ONLY if PAID
            if (order.getStatus() == OrderStatus.PAID) {
                try {
                    String payUrl = paymentBaseUrl + "/" + order.getId();
                    PaymentResponseDTO payment =
                            restTemplate.getForObject(payUrl, PaymentResponseDTO.class);

                    if (payment != null) {
                        dto.setPaymentId(payment.getPaymentId());
                        dto.setPaymentStatus(payment.getStatus());
                        dto.setPdfPath(payment.getPdfPath());
                        dto.setPaymentCreatedAt(payment.getCreatedAt());
                    }

                } catch (Exception e) {
                    System.out.println("⚠️ Payment fetch failed for: " + order.getId());
                }
            }

            return dto;

        }).collect(Collectors.toList());
    }




}
