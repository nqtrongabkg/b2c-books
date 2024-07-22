package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.Option;

public interface OptionRepository extends JpaRepository<Option, UUID> {
    
    List<Option> findByProductId(UUID productId);

    List<Option> findByCreatedBy(UUID id);
}
