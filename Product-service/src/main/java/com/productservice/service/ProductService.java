package com.productservice.service;

import com.productservice.dto.ProductRequest;
import com.productservice.dto.ProductResponse;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request, MultipartFile image) throws Exception;

	List<ProductResponse> getAllProducts();

	ProductResponse updateProduct(String id, ProductRequest request, MultipartFile image) throws Exception;

	void deleteProduct(String id) throws Exception;

	ProductResponse reduceStock(String productId) throws Exception;

	ProductResponse getProductById(String id);

}
