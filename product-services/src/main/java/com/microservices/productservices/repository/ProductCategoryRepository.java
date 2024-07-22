package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.ProductCategory;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {
    List<ProductCategory> findByProductId(UUID productId);
    List<ProductCategory> findByCategoryId(UUID categoryId);
    void deleteByProductIdAndCategoryId(UUID productId, UUID categoryId);
    void deleteByProductId(UUID productId);
    void deleteByCategoryId(UUID categoryId);
}
