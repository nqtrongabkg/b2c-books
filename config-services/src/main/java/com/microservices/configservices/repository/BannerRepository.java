package com.microservices.configservices.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.configservices.entity.Banner;

public interface BannerRepository extends JpaRepository<Banner, UUID> {
    List<Banner> findByStatus(int status);
}
