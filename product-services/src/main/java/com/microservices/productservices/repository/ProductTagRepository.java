package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.ProductTag;

public interface ProductTagRepository extends JpaRepository<ProductTag, UUID> {

    List<ProductTag> findByProductId(UUID productId);

    List<ProductTag> findByTagId(UUID tagId);

    void deleteByProductIdAndTagId(UUID productId, UUID tagId);

    void deleteByProductId(UUID productId);

    void deleteByTagId(UUID tagId);

}
