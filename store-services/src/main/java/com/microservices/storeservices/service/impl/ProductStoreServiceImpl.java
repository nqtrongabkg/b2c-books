package com.microservices.storeservices.service.impl;

import com.microservices.storeservices.entity.ProductStore;
import com.microservices.storeservices.payload.request.ProductStoreRequest;
import com.microservices.storeservices.payload.response.ProductStoreResponse;
import com.microservices.storeservices.repository.ProductStoreRepository;
import com.microservices.storeservices.service.ProductStoreService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductStoreServiceImpl implements ProductStoreService {

    private final ProductStoreRepository productStoreRepository;

    public ProductStoreServiceImpl(ProductStoreRepository productStoreRepository) {
        this.productStoreRepository = productStoreRepository;
    }

    @Override
    public ProductStoreResponse create(ProductStoreRequest productStoreRequest) {
        ProductStore productStore = new ProductStore();
        mapRequestToEntity(productStoreRequest, productStore);
        productStore.setCreatedAt(LocalDateTime.now());
        ProductStore savedProductStore = productStoreRepository.save(productStore);
        return mapProductStoreToResponse(savedProductStore);
    }

    @Override
    public ProductStoreResponse getById(UUID id) {
        ProductStore productStore = productStoreRepository.findById(id).orElse(null);
        if (productStore != null) {
            return mapProductStoreToResponse(productStore);
        }
        return null;
    }

    @Override
    public List<ProductStoreResponse> getAll() {
        List<ProductStore> productStores = productStoreRepository.findAll();
        return productStores.stream()
                .map(this::mapProductStoreToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductStoreResponse update(UUID id, ProductStoreRequest productStoreRequest) {
        ProductStore existingProductStore = productStoreRepository.findById(id).orElse(null);
        if (existingProductStore != null) {
            mapRequestToEntity(productStoreRequest, existingProductStore);
            existingProductStore.setUpdatedAt(LocalDateTime.now());
            ProductStore updatedProductStore = productStoreRepository.save(existingProductStore);
            return mapProductStoreToResponse(updatedProductStore);
        }
        return null;
    }

    @Override
    public ProductStoreResponse delete(UUID id) {
        ProductStore productStore = productStoreRepository.findById(id).orElse(null);
        if (productStore != null) {
            productStoreRepository.delete(productStore);
            return mapProductStoreToResponse(productStore);
        }
        return null;
    }

    @Override
    public void deleteByOptionValueId(UUID optionValueId) {
        List<ProductStore> productStores = productStoreRepository.findByOptionValueId(optionValueId);
        productStores.forEach(productStoreRepository::delete);
    }


    @Override
    public List<ProductStoreResponse> getByProductId(UUID productId) {
        List<ProductStore> productStores = productStoreRepository.findByProductId(productId);
        return productStores.stream()
                .map(this::mapProductStoreToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductStoreResponse> getByCreatedBy(UUID createdBy) {
        List<ProductStore> productStores = productStoreRepository.findByCreatedBy(createdBy);
        return productStores.stream()
                .map(this::mapProductStoreToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductStoreResponse getByOptionValueId(UUID optionValueId) {
        Optional<ProductStore> productStore = productStoreRepository.findByOptionValueId(optionValueId)
            .stream().findFirst();

        if (productStore.isPresent()) {
            return mapProductStoreToResponse(productStore.get());
        }
        return null;
    }

    @Override
    public List<ProductStoreResponse> findByUser(UUID id) {
        List<ProductStore> stores = productStoreRepository.findByCreatedBy(id);
        return stores.stream()
                .map(this::mapProductStoreToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByProductId(UUID productId) {
        List<ProductStore> productStores = productStoreRepository.findByProductId(productId);
        productStores.forEach(productStoreRepository::delete);
    }

    private ProductStoreResponse mapProductStoreToResponse(ProductStore productStore) {
        return ProductStoreResponse.builder()
                .id(productStore.getId())
                .productId(productStore.getProductId())
                .optionValueId(productStore.getOptionValueId())
                .quantity(productStore.getQuantity())
                .soldQuantity(productStore.getSoldQuantity())
                .price(productStore.getPrice())
                .createdAt(productStore.getCreatedAt())
                .updatedAt(productStore.getUpdatedAt())
                .createdBy(productStore.getCreatedBy())
                .updatedBy(productStore.getUpdatedBy())
                .build();
    }

    private void mapRequestToEntity(ProductStoreRequest productStoreRequest, ProductStore productStore) {
        BeanUtils.copyProperties(productStoreRequest, productStore);
    }
}
