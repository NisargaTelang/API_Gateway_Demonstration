package com.productservice.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ProductResponse {
    private String id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
}
