package com.microservices.storeservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.storeservices.entity.ProductImport;

public interface ProductImportRepository extends JpaRepository<ProductImport, UUID> {

    List<ProductImport> findByCreatedBy(UUID userId);

}
