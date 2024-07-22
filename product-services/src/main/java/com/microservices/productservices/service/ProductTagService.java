package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.ProductTagRequest;
import com.microservices.productservices.payload.response.ProductTagResponse;

import java.util.List;
import java.util.UUID;

public interface ProductTagService {

    ProductTagResponse create(ProductTagRequest productTagRequest);

    List<ProductTagResponse> getProductTagsByProductId(UUID productId);

    List<ProductTagResponse> getProductTagsByTagId(UUID tagId);

    void deleteByProductIdAndTagId(UUID productId, UUID tagId);

    void deleteProductTagsByProductId(UUID productId);

    void deleteProductTagsByTagId(UUID tagId);

    List<ProductTagResponse> getAllProductTags();

    ProductTagResponse delete(UUID id);
}