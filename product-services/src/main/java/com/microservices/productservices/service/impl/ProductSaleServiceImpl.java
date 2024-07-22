package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.ProductSale;
import com.microservices.productservices.payload.request.ProductSaleRequest;
import com.microservices.productservices.payload.response.ProductSaleResponse;
import com.microservices.productservices.repository.ProductSaleRepository;
import com.microservices.productservices.service.ProductSaleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductSaleServiceImpl implements ProductSaleService {

    private final ProductSaleRepository productSaleRepository;

    public ProductSaleServiceImpl(ProductSaleRepository productSaleRepository) {
        this.productSaleRepository = productSaleRepository;
    }

    @Override
    public ProductSaleResponse create(ProductSaleRequest productSaleRequest) {
        ProductSale productSale = new ProductSale();
        mapRequestToEntity(productSaleRequest, productSale);
        productSale.setCreatedAt(LocalDateTime.now());
        ProductSale savedProductSale = productSaleRepository.save(productSale);
        return mapProductSaleToResponse(savedProductSale);
    }

    @Override
    public ProductSaleResponse getById(UUID id) {
        ProductSale productSale = productSaleRepository.findById(id).orElse(null);
        if (productSale != null) {
            return mapProductSaleToResponse(productSale);
        }
        return null;
    }

    @Override
    public List<ProductSaleResponse> getAll() {
        List<ProductSale> productSales = productSaleRepository.findAll();
        return productSales.stream()
                .map(this::mapProductSaleToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductSaleResponse> findByUser(UUID id) {
        List<ProductSale> sales = productSaleRepository.findByCreatedBy(id);
        return sales.stream()
                .map(this::mapProductSaleToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductSaleResponse update(UUID id, ProductSaleRequest productSaleRequest) {
        ProductSale existingProductSale = productSaleRepository.findById(id).orElse(null);
        if (existingProductSale != null) {
            mapRequestToEntity(productSaleRequest, existingProductSale);
            existingProductSale.setUpdatedAt(LocalDateTime.now());
            ProductSale updatedProductSale = productSaleRepository.save(existingProductSale);
            return mapProductSaleToResponse(updatedProductSale);
        }
        return null;
    }

    @Override
    public ProductSaleResponse delete(UUID id) {
        ProductSale productSale = productSaleRepository.findById(id).orElse(null);
        if (productSale != null) {
            productSaleRepository.delete(productSale);
            return mapProductSaleToResponse(productSale);
        }
        return null;
    }

    @Override
    public List<ProductSaleResponse> findByProductId(UUID productId) {
        List<ProductSale> productSales = productSaleRepository.findByProductId(productId);
        return productSales.stream()
                .map(this::mapProductSaleToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void switchStatus(UUID id) {
        ProductSale productSale = productSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = productSale.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        productSale.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        productSaleRepository.save(productSale);
    }

    @Override
    public void trash(UUID id) {
        ProductSale productSale = productSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Đặt trạng thái thành 2
        productSale.setStatus(2);

        // Lưu trạng thái đã thay đổi
        productSaleRepository.save(productSale);
    }

    @Override
    public void exportSale(UUID productId, int quantity) {
        List<ProductSale> productSales = productSaleRepository.findByProductIdAndStatus(productId, 1);

        if (productSales.isEmpty()) {
            throw new RuntimeException("NOT_FOUND");
        }

        // Get the most recent ProductSale
        ProductSale mostRecentProductSale = productSales.stream()
                .max(Comparator.comparing(ProductSale::getCreatedAt))
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        if (mostRecentProductSale.getQuantity() >= quantity) {
            mostRecentProductSale.setQuantity(mostRecentProductSale.getQuantity() - quantity);
            productSaleRepository.save(mostRecentProductSale);
        } else {
            throw new RuntimeException("INSUFFICIENT_QUANTITY");
        }
    }

    private ProductSaleResponse mapProductSaleToResponse(ProductSale productSale) {
        return ProductSaleResponse.builder()
                .id(productSale.getId())
                .productId(productSale.getProductId())
                .quantity(productSale.getQuantity())
                .priceSale(productSale.getPriceSale())
                .description(productSale.getDescription())
                .dateBegin(productSale.getDateBegin())
                .dateEnd(productSale.getDateEnd())
                .createdAt(productSale.getCreatedAt())
                .updatedAt(productSale.getUpdatedAt())
                .createdBy(productSale.getCreatedBy())
                .updatedBy(productSale.getUpdatedBy())
                .status(productSale.getStatus())
                .build();
    }

    private void mapRequestToEntity(ProductSaleRequest productSaleRequest, ProductSale productSale) {
        BeanUtils.copyProperties(productSaleRequest, productSale);
    }
}
