package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.ProductGallary;
import com.microservices.productservices.payload.request.ProductGallaryRequest;
import com.microservices.productservices.payload.response.ProductGallaryResponse;
import com.microservices.productservices.repository.ProductGallaryRepository;
import com.microservices.productservices.service.ProductGallaryService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductGallaryServiceImpl implements ProductGallaryService {

    private final ProductGallaryRepository productGallaryRepository;

    public ProductGallaryServiceImpl(ProductGallaryRepository productGallaryRepository) {
        this.productGallaryRepository = productGallaryRepository;
    }

    @Override
    public ProductGallaryResponse create(ProductGallaryRequest productGallaryRequest) {
        ProductGallary productGallary = new ProductGallary();
        mapRequestToEntity(productGallaryRequest, productGallary);
        ProductGallary savedProductGallary = productGallaryRepository.save(productGallary);
        return mapProductGallaryToResponse(savedProductGallary);
    }

    @Override
    public void setImage(UUID id, String image){
        ProductGallary productGallary = productGallaryRepository.findById(id).orElse(null);
        productGallary.setImage(image);
        productGallaryRepository.save(productGallary);
    }

    @Override
    public ProductGallaryResponse getById(UUID id) {
        ProductGallary productGallary = productGallaryRepository.findById(id).orElse(null);
        if (productGallary != null) {
            return mapProductGallaryToResponse(productGallary);
        }
        return null;
    }

    @Override
    public List<ProductGallaryResponse> getAll() {
        List<ProductGallary> productGallaries = productGallaryRepository.findAll();
        return productGallaries.stream()
                .map(this::mapProductGallaryToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductGallaryResponse update(UUID id, ProductGallaryRequest productGallaryRequest) {
        ProductGallary existingProductGallary = productGallaryRepository.findById(id).orElse(null);
        if (existingProductGallary != null) {
            mapRequestToEntity(productGallaryRequest, existingProductGallary);
            ProductGallary updatedProductGallary = productGallaryRepository.save(existingProductGallary);
            return mapProductGallaryToResponse(updatedProductGallary);
        }
        return null;
    }

    @Override
    public ProductGallaryResponse delete(UUID id) {
        ProductGallary productGallary = productGallaryRepository.findById(id).orElse(null);
        if (productGallary != null) {
            productGallaryRepository.delete(productGallary);
            return mapProductGallaryToResponse(productGallary);
        }
        return null;
    }

    @Override
    public void deleteByProductId(UUID productId) {
        productGallaryRepository.deleteByProductId(productId);
    }

    @Override
    public List<ProductGallaryResponse> findByProductId(UUID productId) {
        List<ProductGallary> productGallaries = productGallaryRepository.findByProductId(productId);
        return productGallaries.stream()
                .map(this::mapProductGallaryToResponse)
                .collect(Collectors.toList());
    }

    private ProductGallaryResponse mapProductGallaryToResponse(ProductGallary productGallary) {
        return ProductGallaryResponse.builder()
                .id(productGallary.getId())
                .productId(productGallary.getProductId())
                .image(productGallary.getImage())
                .build();
    }

    private void mapRequestToEntity(ProductGallaryRequest productGallaryRequest, ProductGallary productGallary) {
        BeanUtils.copyProperties(productGallaryRequest, productGallary);
    }
}
