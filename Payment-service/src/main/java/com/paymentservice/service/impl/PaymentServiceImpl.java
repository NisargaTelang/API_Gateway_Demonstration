package com.paymentservice.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.paymentservice.dto.OrderResponseDTO;
import com.paymentservice.dto.OrderStatusUpdateRequestDTO;
import com.paymentservice.dto.PaymentRequestDTO;
import com.paymentservice.dto.PaymentResponseDTO;
import com.paymentservice.dto.ProductDTO;
import com.paymentservice.entity.Payment;
import com.paymentservice.enums.OrderStatus;
import com.paymentservice.repository.PaymentRepository;
import com.paymentservice.service.PaymentService;
import com.paymentservice.util.JwtUtil;
import com.paymentservice.util.PdfGenerator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

	@Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PdfGenerator pdfGenerator;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ModelMapper modelMapper;
   
    

    @Value("${order.service.url}")
    private String orderServiceUrl;

    @Value("${payment.pdf.base-url}")
    private String pdfBaseUrl;
    
    @Value("${product.service.url}")
    private String productServiceUrl;
    
    @Override
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {

//        if (!jwtUtil.validateToken(request.getToken())) {
//            throw new RuntimeException("Invalid or expired token!");
//        }

        String paymentId = UUID.randomUUID().toString();

        // ✅ Update order status
        OrderStatusUpdateRequestDTO updateReq = new OrderStatusUpdateRequestDTO();
        updateReq.setOrderId(request.getOrderId());
        updateReq.setStatus(OrderStatus.PAID);

        OrderResponseDTO updatedOrder =
                restTemplate.postForObject(orderServiceUrl + "/status", updateReq, OrderResponseDTO.class);

        if (updatedOrder == null)
            throw new RuntimeException("Order service returned null when updating status.");

        // ✅ Generate PDF (returns fileName only)
        String fileName = null;
		try {
			fileName = pdfGenerator.generateInvoice(updatedOrder, paymentId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        // ✅ Build actual public link
        String publicPdfUrl = pdfBaseUrl + fileName;  // ✅ http://localhost:8083/bills/BILL_xyz.pdf

        // ✅ Save Payment Record
        Payment payment = Payment.builder()
                .id(paymentId)
                .orderId(updatedOrder.getOrderId())
                .amount(updatedOrder.getPriceSnapshot())
                .status("SUCCESS")
                .pdfPath(publicPdfUrl)   // ✅ store real URL in DB
                .customerEmail(updatedOrder.getEmail())
                .createdAt(Instant.now())
                .build();

        paymentRepository.save(payment);
        
        String reduceStockUrl = productServiceUrl 
                + "/" + updatedOrder.getProductId() 
                + "/stock/reduce";

        try {
            restTemplate.put(reduceStockUrl, null);
            log.info("✅ Stock reduced for product: {}", updatedOrder.getProductId());
        } catch (Exception e) {
            log.error("❌ Failed to reduce stock for product {}", updatedOrder.getProductId(), e);
        }


        // ✅ Return response
        return PaymentResponseDTO.builder()
                .paymentId(paymentId)
                .orderId(updatedOrder.getOrderId())
                .message("Payment successful & bill generated")
                .pdfPath(publicPdfUrl)     // ✅ actual accessible URL
                .build();
    }
    
    @Override
    public String getPdfLinkByOrderId(String orderId) {

        if (orderId == null || orderId.isBlank()) {
            throw new RuntimeException("Order ID cannot be null or empty");
        }

        List<String> paths = paymentRepository.getPdfPathByOrderIdList(orderId);

        if (paths == null || paths.isEmpty()) {
            throw new RuntimeException("No payment found for given order ID: " + orderId);
        }

        // ✅ Return first result
        return paths.get(0);
    }

    
    @Override
    public PaymentResponseDTO getPaymentByOrderId(String orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No payment found for orderId: " + orderId));

        return PaymentResponseDTO.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .pdfPath(payment.getPdfPath()) 
                .createdAt(payment.getCreatedAt())
                .status(payment.getStatus())// ✅ accessible link
                .message("Payment details fetched successfully")
                .build();
    }




}
