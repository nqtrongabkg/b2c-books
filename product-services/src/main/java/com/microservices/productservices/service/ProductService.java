package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.ProductRequest;
import com.microservices.productservices.payload.response.ProductResponse;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;

public interface ProductService {
    
    ProductResponse create(ProductRequest productRequest);

    void setImage(UUID id, String image);

    void switchStatus(UUID id);

    void trash(UUID id);

    void isDisplay(UUID id);
    
    ProductResponse getById(UUID id);
    
    List<ProductResponse> getAll();
    
    ProductResponse update(UUID id, ProductRequest productRequest);
    
    ProductResponse delete(UUID id);
    
    List<ProductResponse> findByBrandId(UUID brandId);

    List<ProductResponse> searchByName(String name);

    void updateProductEvaluate(UUID productId);

    Page<ProductResponse> findByUser(UUID userId, int page, int size);

    List<ProductResponse> findAllByUser(UUID userId);

    Page<ProductResponse> getPage(int page, int size);
    
}
