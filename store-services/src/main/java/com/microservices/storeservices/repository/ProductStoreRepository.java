package com.microservices.storeservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.storeservices.entity.ProductStore;

public interface ProductStoreRepository extends JpaRepository<ProductStore, UUID> {

    List<ProductStore> findByCreatedBy(UUID createdBy);

    List<ProductStore> findByProductId(UUID productId);

    List<ProductStore> findByOptionValueId(UUID optionValueId);
}
