package com.paymentservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paymentservice.dto.PaymentRequestDTO;
import com.paymentservice.dto.PaymentResponseDTO;
import com.paymentservice.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> processPayment(@RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }
    
    @GetMapping("/pdf/{orderId}")
    public ResponseEntity<String> getPdfUrl(@PathVariable String orderId) {
        String url = paymentService.getPdfLinkByOrderId(orderId);
        return ResponseEntity.ok(url);
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentbyOrderId(@PathVariable String orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }


}
