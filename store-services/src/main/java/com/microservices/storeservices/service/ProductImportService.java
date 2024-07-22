package com.microservices.storeservices.service;

import com.microservices.storeservices.payload.request.ProductImportRequest;
import com.microservices.storeservices.payload.response.ProductImportResponse;

import java.util.List;
import java.util.UUID;

public interface ProductImportService {

    ProductImportResponse create(ProductImportRequest productImportRequest);

    ProductImportResponse getById(UUID id);

    List<ProductImportResponse> getAll();

    ProductImportResponse update(UUID id, ProductImportRequest productImportRequest);

    ProductImportResponse delete(UUID id);

    List<ProductImportResponse> getByUser(UUID userId);
}
