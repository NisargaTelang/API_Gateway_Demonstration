package com.paymentservice.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDTO {
	
    private String id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;

}
