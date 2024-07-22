package com.microservices.storeservices.service;

import com.microservices.storeservices.payload.request.ProductExportRequest;
import com.microservices.storeservices.payload.response.ProductExportResponse;

import java.util.List;
import java.util.UUID;

public interface ProductExportService {

    ProductExportResponse create(ProductExportRequest productExportRequest);

    ProductExportResponse getById(UUID id);

    List<ProductExportResponse> getAll();

    ProductExportResponse update(UUID id, ProductExportRequest productExportRequest);

    ProductExportResponse delete(UUID id);

    List<ProductExportResponse> getByProductId(UUID productId);

    List<ProductExportResponse> getByUser(UUID userId);

}
