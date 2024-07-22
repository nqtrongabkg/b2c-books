package com.microservices.configservices.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.configservices.entity.Slider;

public interface SliderRepository extends JpaRepository<Slider, UUID> {

}
