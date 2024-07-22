package com.microservices.configservices.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.microservices.configservices.entity.Information;

public interface InformationRepository extends JpaRepository<Information, UUID> {

    @Query("SELECT i FROM Information i WHERE i.status = 3 ORDER BY i.createdAt DESC")
    Optional<Information> findLatestInformationWithStatusThree();

}
