package com.microservices.userservices.service.impl;

import com.microservices.userservices.entity.Notification;
import com.microservices.userservices.exception.CustomException;
import com.microservices.userservices.payload.request.NotificationRequest;
import com.microservices.userservices.payload.response.NotificationResponse;
import com.microservices.userservices.repository.NotificationRepository;
import com.microservices.userservices.service.NotificationService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationResponse create(NotificationRequest notificationRequest) {
        Notification notification = new Notification();
        mapRequestToEntity(notificationRequest, notification);
        notification.setCreatedAt(LocalDateTime.now());
        Notification savedNotification = notificationRepository.save(notification);
        return mapEntityToResponse(savedNotification);
    }

    @Override
    public NotificationResponse getById(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Notification not found", "NOT_FOUND"));
        return mapEntityToResponse(notification);
    }

    @Override
    public List<NotificationResponse> getAll() {
        List<Notification> notifications = notificationRepository.findAll();
        return notifications.stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponse update(UUID id, NotificationRequest notificationRequest) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Notification not found", "NOT_FOUND"));
        mapRequestToEntity(notificationRequest, notification);
        notification.setCreatedAt(LocalDateTime.now());
        Notification savedNotification = notificationRepository.save(notification);
        return mapEntityToResponse(savedNotification);
    }

    @Override
    public NotificationResponse delete(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Notification not found", "NOT_FOUND"));
        notificationRepository.delete(notification);
        return mapEntityToResponse(notification);
    }

    @Override
    public List<NotificationResponse> getByUser(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndStatusNot(userId, 0);
        return notifications.stream()
                .sorted(Comparator.comparing(Notification::getCreatedAt).reversed())
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void switchStatus(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("not found", "NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = notification.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        notification.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        notificationRepository.save(notification);
    }

    @Override
    public void seen(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("not found", "NOT_FOUND"));
        notification.setStatusOfSee(1);
        // Lưu trạng thái đã chuyển đổi
        notificationRepository.save(notification);
    }

    @Override
    public void trash(UUID id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));

        // Đặt trạng thái thành 2
        notification.setStatus(2);

        // Lưu trạng thái đã thay đổi
        notificationRepository.save(notification);
    }

    @Override
    public int countUnseenByUser(UUID userId) {
        return notificationRepository.countByUserIdAndStatusOfSee(userId, 0);
    }

    private void mapRequestToEntity(NotificationRequest notificationRequest, Notification notification) {
        BeanUtils.copyProperties(notificationRequest, notification);
    }

    private NotificationResponse mapEntityToResponse(Notification notification) {
        NotificationResponse notificationResponse = new NotificationResponse();
        BeanUtils.copyProperties(notification, notificationResponse);
        return notificationResponse;
    }
}
