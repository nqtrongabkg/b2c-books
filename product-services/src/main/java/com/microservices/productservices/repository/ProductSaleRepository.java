package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.ProductSale;

public interface ProductSaleRepository extends JpaRepository<ProductSale, UUID> {

    List<ProductSale> findByProductId(UUID productId);

    List<ProductSale> findByCreatedBy(UUID id);

    List<ProductSale> findByProductIdAndStatus(UUID productId, int status);
}
