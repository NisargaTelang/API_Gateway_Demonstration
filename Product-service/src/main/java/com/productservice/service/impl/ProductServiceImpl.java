package com.productservice.service.impl;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.productservice.dto.ProductRequest;
import com.productservice.dto.ProductResponse;
import com.productservice.entity.Product;
import com.productservice.exception.BadRequestException;
import com.productservice.exception.LowStockException;
import com.productservice.exception.ProductNotFoundException;
import com.productservice.exception.ResourceNotFoundException;
import com.productservice.repository.ProductRepository;
import com.productservice.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ModelMapper mapper;

	@Value("${app.upload.base-path}")
	private String basePath;

	@Value("${app.images.folder}")
	private String productFolder;

	@Value("${app.base-url}")
	private String baseUrl;

	@Override
	public ProductResponse createProduct(ProductRequest request, MultipartFile image) throws Exception {

		if (image == null || image.isEmpty()) {
			throw new BadRequestException("Image file is required");
		}

		String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
		Path folderPath = Paths.get(basePath + productFolder);
		Files.createDirectories(folderPath);

		Path filePath = folderPath.resolve(fileName);
		Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

		// store only relative path
		String imageRelativePath = productFolder + fileName;

		Product product = Product.builder().name(request.getName()).price(request.getPrice())
				.quantity(request.getQuantity()).imageUrl(imageRelativePath).build();

		Product saved = productRepository.save(product);

		ProductResponse res = mapper.map(saved, ProductResponse.class);
		// convert relative path to HTTP url
		res.setImageUrl(baseUrl + saved.getImageUrl());

		return res;
	}

	@Override
	public ProductResponse reduceStock(String productId) throws Exception {

		

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

		if (product.getQuantity() <= 0) {
			throw new LowStockException("Insufficient stock. Available: " + product.getQuantity());
		}

		product.setQuantity(product.getQuantity() - 1);

		Product updated = productRepository.save(product);

		ProductResponse res = mapper.map(updated, ProductResponse.class);
		res.setImageUrl(baseUrl + updated.getImageUrl());

		return res;
	}

	@Override
	public ProductResponse updateProduct(String id, ProductRequest request, MultipartFile image) throws Exception {

		Product existing = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));

		// partial update only if request != null
		if (request != null) {
			if (request.getName() != null)
				existing.setName(request.getName());
			if (request.getPrice() != null)
				existing.setPrice(request.getPrice());
			if (request.getQuantity() != null)
				existing.setQuantity(request.getQuantity());
		}

		// handle image update if new image provided
		if (image != null && !image.isEmpty()) {

			// delete old
			if (existing.getImageUrl() != null) {
				Path oldFile = Paths.get(basePath + existing.getImageUrl());
				Files.deleteIfExists(oldFile);
			}

			// save new
			String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
			Path folderPath = Paths.get(basePath + productFolder);
			Files.createDirectories(folderPath);
			Path newFilePath = folderPath.resolve(fileName);
			Files.copy(image.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);

			existing.setImageUrl(productFolder + fileName);
		}

		Product saved = productRepository.save(existing);
		return mapper.map(saved, ProductResponse.class);
	}

	@Override
	public List<ProductResponse> getAllProducts() {

	    return productRepository.findAll().stream()
	            .filter(p -> p.getQuantity() != null && p.getQuantity() > 0) // ✅ Only in-stock products
	            .map(p -> {
	                ProductResponse r = mapper.map(p, ProductResponse.class);
	                r.setImageUrl(baseUrl + p.getImageUrl());
	                return r;
	            })
	            .toList();
	}


	@Override
	public void deleteProduct(String id) throws Exception {

		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));

		// delete file
		if (product.getImageUrl() != null) {
			Path imagePath = Paths.get(basePath + product.getImageUrl());
			Files.deleteIfExists(imagePath);
		}

		productRepository.delete(product);
	}

	@Override
	public ProductResponse getProductById(String id) {
	    try {
	        // ✅ Find product or throw
	        Product product = productRepository.findById(id)
	                .orElseThrow(() -> new ProductNotFoundException(
	                        "Product not found with id: " + id));

	        // ✅ Map entity → DTO
	        ProductResponse response = mapper.map(product, ProductResponse.class);

	        // ✅ Attach full image URL
	        if (response.getImageUrl() != null) {
	            response.setImageUrl(baseUrl + response.getImageUrl());
	        }

	        return response;

	    } catch (ProductNotFoundException ex) {
	        // ✅ Re-throw custom exception (for Global Exception Handler)
	        throw ex;

	    } catch (Exception ex) {
	        // ✅ Unexpected mapping/DB error → wrap into custom exception
	        throw new ProductNotFoundException(
	                "Something went wrong while fetching product with id: " + id);
	    }
	}


}
