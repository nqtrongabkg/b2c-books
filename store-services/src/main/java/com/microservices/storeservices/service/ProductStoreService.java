package com.microservices.storeservices.service;

import com.microservices.storeservices.payload.request.ProductStoreRequest;
import com.microservices.storeservices.payload.response.ProductStoreResponse;

import java.util.List;
import java.util.UUID;

public interface ProductStoreService {

    ProductStoreResponse create(ProductStoreRequest productStoreRequest);

    ProductStoreResponse getById(UUID id);

    List<ProductStoreResponse> getAll();

    ProductStoreResponse update(UUID id, ProductStoreRequest productStoreRequest);

    ProductStoreResponse delete(UUID id);

    List<ProductStoreResponse> getByProductId(UUID productId);

    List<ProductStoreResponse> getByCreatedBy(UUID createdBy);

    void deleteByOptionValueId(UUID optionValueId);

    ProductStoreResponse getByOptionValueId(UUID optionValueId);

    List<ProductStoreResponse> findByUser(UUID id);

    void deleteByProductId(UUID productId);
}
