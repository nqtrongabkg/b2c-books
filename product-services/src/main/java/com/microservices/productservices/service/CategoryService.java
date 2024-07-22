package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.CategoryRequest;
import com.microservices.productservices.payload.response.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    CategoryResponse create(CategoryRequest categoryRequest);

    void setImage(UUID id, String image);

    void switchStatus(UUID id);

    void trash(UUID id);

    void isDisplay(UUID id);

    CategoryResponse getById(UUID id);

    List<CategoryResponse> getAll();

    CategoryResponse update(UUID id, CategoryRequest categoryRequest);

    CategoryResponse delete(UUID id);

    void addProductQty(UUID id);

    List<CategoryResponse> searchByName(String name);
}
