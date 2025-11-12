package com.paymentservice.service;

import java.util.List;

import com.paymentservice.dto.PaymentRequestDTO;
import com.paymentservice.dto.PaymentResponseDTO;

public interface PaymentService {
    PaymentResponseDTO processPayment(PaymentRequestDTO request);
    
    String getPdfLinkByOrderId(String orderId);
    
    PaymentResponseDTO getPaymentByOrderId(String orderId);



}
