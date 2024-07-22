package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.Category;
import com.microservices.productservices.payload.request.CategoryRequest;
import com.microservices.productservices.payload.response.CategoryResponse;
import com.microservices.productservices.repository.CategoryRepository;
import com.microservices.productservices.service.CategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse create(CategoryRequest categoryRequest) {
        Category category = new Category();
        mapRequestToEntity(categoryRequest, category);
        category.setCreatedAt(LocalDateTime.now());
        Category savedCategory = categoryRepository.save(category);
        return mapCategoryToCategoryResponse(savedCategory);
    }

    @Override
    public void setImage(UUID id, String image) {
        Category category = categoryRepository.findById(id).orElse(null);
        category.setImage(image);
        categoryRepository.save(category);
    }

    @Override
    public void switchStatus(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = category.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        category.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        categoryRepository.save(category);
    }

    @Override
    public void trash(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Đặt trạng thái thành 2
        category.setStatus(2);

        // Lưu trạng thái đã thay đổi
        categoryRepository.save(category);
    }

    @Override
    public void isDisplay(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = category.getStatus();
        int newStatus = (currentStatus == 3) ? 1 : 3;
        category.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        categoryRepository.save(category);
    }

    @Override
    public void addProductQty(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Increment the product quantity by 1
        category.setProductQuantity(category.getProductQuantity() + 1);

        // Save the updated category
        categoryRepository.save(category);
    }

    @Override
    public CategoryResponse getById(UUID id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category != null) {
            return mapCategoryToCategoryResponse(category);
        }
        return null;
    }

    @Override
    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::mapCategoryToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse update(UUID id, CategoryRequest categoryRequest) {
        Category existingCategory = categoryRepository.findById(id).orElse(null);
        if (existingCategory != null) {
            mapRequestToEntity(categoryRequest, existingCategory);
            existingCategory.setUpdatedAt(LocalDateTime.now());
            Category updatedCategory = categoryRepository.save(existingCategory);
            return mapCategoryToCategoryResponse(updatedCategory);
        }
        return null;
    }

    @Override
    public CategoryResponse delete(UUID id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category != null) {
            categoryRepository.delete(category);
            return mapCategoryToCategoryResponse(category);
        }
        return null;
    }

    @Override
    public List<CategoryResponse> searchByName(String name) {
        List<Category> categories = categoryRepository.findByNameContainingIgnoreCase(name);
        return categories.stream()
                .map(this::mapCategoryToCategoryResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse mapCategoryToCategoryResponse(Category category) {
        if (category != null) {
            return CategoryResponse.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .image(category.getImage())
                    .productQuantity(category.getProductQuantity())
                    .description(category.getDescription())
                    .createdAt(category.getCreatedAt())
                    .updatedAt(category.getUpdatedAt())
                    .createdBy(category.getCreatedBy())
                    .updatedBy(category.getUpdatedBy())
                    .status(category.getStatus())
                    .build();
        }
        return null;
    }

    private void mapRequestToEntity(CategoryRequest categoryRequest, Category category) {
        BeanUtils.copyProperties(categoryRequest, category);
    }
}
