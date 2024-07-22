package com.microservices.userservices.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;


import com.microservices.userservices.entity.User;

public interface UserRepository extends JpaRepository<User, UUID>{

    User findByEmail(String email);
    Optional<User> findByUserName(String username);
}