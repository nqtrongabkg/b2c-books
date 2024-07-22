package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.Product;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByBrandId(UUID brandId);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCreatedBy(UUID id);

    Page<Product> findByCreatedBy(UUID userId, Pageable pageable);

    Page<Product> findByStatusNot(int i, Pageable pageable);
}
