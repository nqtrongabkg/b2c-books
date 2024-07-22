package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, UUID>{

    List<Brand> findByCreatedBy(UUID createdBy);

    List<Brand> findByStatusOrCreatedBy(int i, UUID id);

    List<Brand> findByNameContainingIgnoreCase(String name);
}
