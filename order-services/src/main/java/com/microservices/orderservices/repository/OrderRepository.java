package com.microservices.orderservices.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.orderservices.entity.Order;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByUserId(UUID userId);

    Optional<Order> findFirstByStatus(Integer status);

    Optional<Order> findFirstByUserIdAndStatus(UUID userId, int i);
}
