package com.microservices.userservices.service;

import java.util.List;
import java.util.UUID;

import com.microservices.userservices.payload.request.NotificationRequest;
import com.microservices.userservices.payload.response.NotificationResponse;

public interface NotificationService {

    NotificationResponse create(NotificationRequest notificationRequest);

    NotificationResponse getById(UUID id);

    List<NotificationResponse> getAll();
    
    NotificationResponse update(UUID id, NotificationRequest notificationRequest);

    NotificationResponse delete(UUID id);

    List<NotificationResponse> getByUser(UUID userId);

    void switchStatus(UUID id);

    void trash(UUID id);

    void seen(UUID id);

    int countUnseenByUser(UUID userId);
}
