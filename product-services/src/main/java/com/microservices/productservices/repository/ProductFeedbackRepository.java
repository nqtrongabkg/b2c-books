package com.microservices.productservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.microservices.productservices.entity.ProductFeedback;

public interface ProductFeedbackRepository extends JpaRepository<ProductFeedback, UUID> {

    List<ProductFeedback> findByProductId(UUID productId);

    @Query("SELECT AVG(pf.evaluate) FROM ProductFeedback pf WHERE pf.productId = :productId")
    Double findAverageEvaluateByProductId(UUID productId);

}
