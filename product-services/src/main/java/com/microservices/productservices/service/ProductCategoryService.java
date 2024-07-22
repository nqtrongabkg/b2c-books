package com.microservices.productservices.service;

import com.microservices.productservices.payload.response.ProductCategoryResponse;

import java.util.List;
import java.util.UUID;

public interface ProductCategoryService {

    ProductCategoryResponse createProductCategory(UUID productId, UUID categoryId);

    List<ProductCategoryResponse> getProductCategoriesByProductId(UUID productId);

    List<ProductCategoryResponse> getProductCategoriesByCategoryId(UUID categoryId);

    void deleteProductCategory(UUID productId, UUID categoryId);

    void deleteProductCategoriesByProductId(UUID productId);

    void deleteProductCategoriesByCategoryId(UUID categoryId);

    List<ProductCategoryResponse> getAllProductCategories();

    ProductCategoryResponse delete(UUID id);
}
