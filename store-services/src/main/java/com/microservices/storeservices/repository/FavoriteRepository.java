package com.microservices.storeservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.storeservices.entity.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    List<Favorite> findByProductId(UUID productId);

    List<Favorite> findByUserId(UUID userId);

}
