package com.productservice.controller;

import com.productservice.dto.ProductRequest;
import com.productservice.dto.ProductResponse;
import com.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart("data") ProductRequest request,
            @RequestPart("image") MultipartFile image) throws Exception {
    	
        return ResponseEntity.ok(productService.createProduct(request, image));
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String id,
            @RequestPart(value = "data", required = false) ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {

        return ResponseEntity.ok(productService.updateProduct(id, request, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable String id) throws Exception {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
    
    @PutMapping("/{id}/stock/reduce")
    public ResponseEntity<ProductResponse> reduceStock(
            @PathVariable String id) throws Exception {
        return ResponseEntity.ok(productService.reduceStock(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductbyID(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }



}
