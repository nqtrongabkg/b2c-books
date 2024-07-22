package com.microservices.storeservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.storeservices.entity.ProductExport;

public interface ProductExportRepository extends JpaRepository<ProductExport, UUID> {

    List<ProductExport> findByProductId(UUID productId);

    List<ProductExport> findByCreatedBy(UUID userId);

}
