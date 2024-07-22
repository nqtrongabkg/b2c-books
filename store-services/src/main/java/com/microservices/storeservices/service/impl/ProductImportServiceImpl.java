package com.microservices.storeservices.service.impl;

import com.microservices.storeservices.entity.ProductImport;
import com.microservices.storeservices.payload.request.ProductImportRequest;
import com.microservices.storeservices.payload.response.ProductImportResponse;
import com.microservices.storeservices.repository.ProductImportRepository;
import com.microservices.storeservices.service.ProductImportService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductImportServiceImpl implements ProductImportService {

    private final ProductImportRepository productImportRepository;

    public ProductImportServiceImpl(ProductImportRepository productImportRepository) {
        this.productImportRepository = productImportRepository;
    }

    @Override
    public ProductImportResponse create(ProductImportRequest productImportRequest) {
        ProductImport productImport = new ProductImport();
        mapRequestToEntity(productImportRequest, productImport);
        productImport.setCreatedAt(LocalDateTime.now());
        ProductImport savedProductImport = productImportRepository.save(productImport);
        return mapProductImportToResponse(savedProductImport);
    }

    @Override
    public ProductImportResponse getById(UUID id) {
        ProductImport productImport = productImportRepository.findById(id).orElse(null);
        if (productImport != null) {
            return mapProductImportToResponse(productImport);
        }
        return null;
    }

    @Override
    public List<ProductImportResponse> getAll() {
        List<ProductImport> productImports = productImportRepository.findAll();
        return productImports.stream()
                .map(this::mapProductImportToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductImportResponse update(UUID id, ProductImportRequest productImportRequest) {
        ProductImport existingProductImport = productImportRepository.findById(id).orElse(null);
        if (existingProductImport != null) {
            mapRequestToEntity(productImportRequest, existingProductImport);
            existingProductImport.setUpdatedAt(LocalDateTime.now());
            ProductImport updatedProductImport = productImportRepository.save(existingProductImport);
            return mapProductImportToResponse(updatedProductImport);
        }
        return null;
    }

    @Override
    public ProductImportResponse delete(UUID id) {
        ProductImport productImport = productImportRepository.findById(id).orElse(null);
        if (productImport != null) {
            productImportRepository.delete(productImport);
            return mapProductImportToResponse(productImport);
        }
        return null;
    }

    @Override
    public List<ProductImportResponse> getByUser(UUID userId) {
        List<ProductImport> productImports = productImportRepository.findByCreatedBy(userId);
        return productImports.stream()
                .map(this::mapProductImportToResponse)
                .collect(Collectors.toList());
    }

    private ProductImportResponse mapProductImportToResponse(ProductImport productImport) {
        return ProductImportResponse.builder()
                .id(productImport.getId())
                .storeId(productImport.getStoreId())
                .quantity(productImport.getQuantity())
                .price(productImport.getPrice())
                .description(productImport.getDescription())
                .createdAt(productImport.getCreatedAt())
                .updatedAt(productImport.getUpdatedAt())
                .createdBy(productImport.getCreatedBy())
                .updatedBy(productImport.getUpdatedBy())
                .build();
    }

    private void mapRequestToEntity(ProductImportRequest productImportRequest, ProductImport productImport) {
        BeanUtils.copyProperties(productImportRequest, productImport);
    }
}
