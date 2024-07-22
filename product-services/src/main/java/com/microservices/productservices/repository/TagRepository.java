package com.microservices.productservices.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.productservices.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, UUID> {

}
