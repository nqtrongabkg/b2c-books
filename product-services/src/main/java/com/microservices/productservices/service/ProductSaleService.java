package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.ProductSaleRequest;
import com.microservices.productservices.payload.response.ProductSaleResponse;

import java.util.List;
import java.util.UUID;

public interface ProductSaleService {

    ProductSaleResponse create(ProductSaleRequest productSaleRequest);

    ProductSaleResponse getById(UUID id);

    List<ProductSaleResponse> getAll();

    ProductSaleResponse update(UUID id, ProductSaleRequest productSaleRequest);

    ProductSaleResponse delete(UUID id);

    List<ProductSaleResponse> findByProductId(UUID productId);

    List<ProductSaleResponse> findByUser(UUID id);

    void switchStatus(UUID id);

    void trash(UUID id);

    void exportSale(UUID id, int quantity);
}
