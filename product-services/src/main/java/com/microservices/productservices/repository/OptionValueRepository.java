package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.OptionValue;

public interface OptionValueRepository extends JpaRepository<OptionValue, UUID> {

    List<OptionValue> findByOptionId(UUID optionId);

}
