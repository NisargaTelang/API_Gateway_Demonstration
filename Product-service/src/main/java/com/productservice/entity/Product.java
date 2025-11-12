package com.productservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @UuidGenerator
    private String id;

    private String name;
    private BigDecimal price;
    private Integer quantity;

    // image location from MinIO
    private String imageUrl;
}
