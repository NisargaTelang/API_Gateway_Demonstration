package com.paymentservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.paymentservice.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, String> {

	@Query("SELECT p.pdfPath FROM Payment p WHERE p.orderId = :orderId ORDER BY p.createdAt ASC")
	List<String> getPdfPathByOrderIdList(String orderId);

	Optional<Payment> findByOrderId(String orderId);

}
