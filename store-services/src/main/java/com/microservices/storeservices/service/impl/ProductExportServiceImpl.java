package com.microservices.storeservices.service.impl;

import com.microservices.storeservices.entity.ProductExport;
import com.microservices.storeservices.payload.request.ProductExportRequest;
import com.microservices.storeservices.payload.response.ProductExportResponse;
import com.microservices.storeservices.repository.ProductExportRepository;
import com.microservices.storeservices.service.ProductExportService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductExportServiceImpl implements ProductExportService {

    private final ProductExportRepository productExportRepository;

    public ProductExportServiceImpl(ProductExportRepository productExportRepository) {
        this.productExportRepository = productExportRepository;
    }

    @Override
    public ProductExportResponse create(ProductExportRequest productExportRequest) {
        ProductExport productExport = new ProductExport();
        mapRequestToEntity(productExportRequest, productExport);
        productExport.setCreatedAt(LocalDateTime.now());
        ProductExport savedProductExport = productExportRepository.save(productExport);
        return mapProductExportToResponse(savedProductExport);
    }

    @Override
    public ProductExportResponse getById(UUID id) {
        ProductExport productExport = productExportRepository.findById(id).orElse(null);
        if (productExport != null) {
            return mapProductExportToResponse(productExport);
        }
        return null;
    }

    @Override
    public List<ProductExportResponse> getAll() {
        List<ProductExport> productExports = productExportRepository.findAll();
        return productExports.stream()
                .map(this::mapProductExportToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductExportResponse update(UUID id, ProductExportRequest productExportRequest) {
        ProductExport existingProductExport = productExportRepository.findById(id).orElse(null);
        if (existingProductExport != null) {
            mapRequestToEntity(productExportRequest, existingProductExport);
            existingProductExport.setUpdatedAt(LocalDateTime.now());
            ProductExport updatedProductExport = productExportRepository.save(existingProductExport);
            return mapProductExportToResponse(updatedProductExport);
        }
        return null;
    }

    @Override
    public ProductExportResponse delete(UUID id) {
        ProductExport productExport = productExportRepository.findById(id).orElse(null);
        if (productExport != null) {
            productExportRepository.delete(productExport);
            return mapProductExportToResponse(productExport);
        }
        return null;
    }

    @Override
    public List<ProductExportResponse> getByProductId(UUID productId) {
        List<ProductExport> productExports = productExportRepository.findByProductId(productId);
        return productExports.stream()
                .map(this::mapProductExportToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductExportResponse> getByUser(UUID userId) {
        List<ProductExport> productExports = productExportRepository.findByCreatedBy(userId);
        return productExports.stream()
                .map(this::mapProductExportToResponse)
                .collect(Collectors.toList());
    }

    private ProductExportResponse mapProductExportToResponse(ProductExport productExport) {
        return ProductExportResponse.builder()
                .id(productExport.getId())
                .orderItemId(productExport.getOrderItemId())
                .productId(productExport.getProductId())
                .quantity(productExport.getQuantity())
                .price(productExport.getPrice())
                .description(productExport.getDescription())
                .createdAt(productExport.getCreatedAt())
                .updatedAt(productExport.getUpdatedAt())
                .createdBy(productExport.getCreatedBy())
                .updatedBy(productExport.getUpdatedBy())
                .build();
    }

    private void mapRequestToEntity(ProductExportRequest productExportRequest, ProductExport productExport) {
        BeanUtils.copyProperties(productExportRequest, productExport);
    }
}
