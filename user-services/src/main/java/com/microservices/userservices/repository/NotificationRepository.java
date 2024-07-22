package com.microservices.userservices.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import com.microservices.userservices.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    List<Notification> findByUserId(UUID userId);

    int countByUserIdAndStatusOfSee(UUID userId, int statusOfSee);

    List<Notification> findByUserIdAndStatusNot(UUID userId, int i);
}
