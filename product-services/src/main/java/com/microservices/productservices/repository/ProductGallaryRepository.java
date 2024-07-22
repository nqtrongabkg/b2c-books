package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.ProductGallary;

public interface ProductGallaryRepository extends JpaRepository<ProductGallary, UUID> {

    List<ProductGallary> findByProductId(UUID productId);

    void deleteByProductId(UUID productId);

}
