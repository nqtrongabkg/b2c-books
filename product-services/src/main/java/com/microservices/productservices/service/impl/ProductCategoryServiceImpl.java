package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.ProductCategory;
import com.microservices.productservices.payload.response.ProductCategoryResponse;
import com.microservices.productservices.repository.ProductCategoryRepository;
import com.microservices.productservices.service.ProductCategoryService;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryServiceImpl(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public ProductCategoryResponse createProductCategory(UUID productId, UUID categoryId) {
        ProductCategory productCategory = new ProductCategory();
        productCategory.setProductId(productId);
        productCategory.setCategoryId(categoryId);
        ProductCategory savedProductCategory = productCategoryRepository.save(productCategory);
        return mapProductCategoryToResponse(savedProductCategory);
    }

    @Override
    public List<ProductCategoryResponse> getProductCategoriesByProductId(UUID productId) {
        List<ProductCategory> productCategories = productCategoryRepository.findByProductId(productId);
        return mapProductCategoriesToResponse(productCategories);
    }

    @Override
    public List<ProductCategoryResponse> getProductCategoriesByCategoryId(UUID categoryId) {
        List<ProductCategory> productCategories = productCategoryRepository.findByCategoryId(categoryId);
        return mapProductCategoriesToResponse(productCategories);
    }

    @Override
    public void deleteProductCategory(UUID productId, UUID categoryId) {
        productCategoryRepository.deleteByProductIdAndCategoryId(productId, categoryId);
    }

    @Transactional
    @Override
    public void deleteProductCategoriesByProductId(UUID productId) {
        productCategoryRepository.deleteByProductId(productId);
    }

    @Override
    public void deleteProductCategoriesByCategoryId(UUID categoryId) {
        productCategoryRepository.deleteByCategoryId(categoryId);
    }

    @Override
    public List<ProductCategoryResponse> getAllProductCategories() {
        List<ProductCategory> productCategories = productCategoryRepository.findAll();
        return mapProductCategoriesToResponse(productCategories);
    }

    @Override
    public ProductCategoryResponse delete(UUID id) {
        ProductCategory productCategory = productCategoryRepository.findById(id).orElse(null);
        if (productCategory != null) {
            productCategoryRepository.delete(productCategory);
            return mapProductCategoryToResponse(productCategory);
        }
        return null;
    }

    // Helper method to map ProductCategory to ProductCategoryResponse
    private ProductCategoryResponse mapProductCategoryToResponse(ProductCategory productCategory) {
        return ProductCategoryResponse.builder()
                .id(productCategory.getId())
                .productId(productCategory.getProductId())
                .categoryId(productCategory.getCategoryId())
                .build();
    }

    // Helper method to map list of ProductCategory to list of ProductCategoryResponse
    private List<ProductCategoryResponse> mapProductCategoriesToResponse(List<ProductCategory> productCategories) {
        return productCategories.stream()
                .map(this::mapProductCategoryToResponse)
                .collect(Collectors.toList());
    }
}
