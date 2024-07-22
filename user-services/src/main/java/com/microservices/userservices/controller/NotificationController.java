package com.microservices.userservices.controller;

import com.microservices.userservices.payload.request.NotificationRequest;
import com.microservices.userservices.payload.response.NotificationResponse;
import com.microservices.userservices.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("user-services/api/notifications")
@CrossOrigin(origins = { "http://localhost:3000" })
public class NotificationController {

    @Autowired
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/create")
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody NotificationRequest notificationRequest) {
        NotificationResponse createdNotification = notificationService.create(notificationRequest);
        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable UUID id) {
        NotificationResponse notification = notificationService.getById(id);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<NotificationResponse>> getAllNotifications() {
        List<NotificationResponse> notifications = notificationService.getAll();
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<NotificationResponse> updateNotification(@RequestBody NotificationRequest notificationRequest, @PathVariable UUID id) {
        NotificationResponse updatedNotification = notificationService.update(id, notificationRequest);
        return ResponseEntity.ok(updatedNotification);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<NotificationResponse> deleteNotification(@PathVariable UUID id) {
        NotificationResponse deletedNotification = notificationService.delete(id);
        return ResponseEntity.ok(deletedNotification);
    }

    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByUser(@PathVariable UUID userId) {
        List<NotificationResponse> notifications = notificationService.getByUser(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        notificationService.switchStatus(id);
        return ResponseEntity.ok().build();
    }   
    @PutMapping("/seen/{id}")
    public ResponseEntity<Void> seen(@PathVariable UUID id) {
        notificationService.seen(id);
        return ResponseEntity.ok().build();
    }   
    
    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        notificationService.trash(id);
        return ResponseEntity.ok().build();
    }    

    @GetMapping("/count-unseen-by-user/{userId}")
    public ResponseEntity<Integer> countUnseenByUser(@PathVariable UUID userId) {
        int count = notificationService.countUnseenByUser(userId);
        return ResponseEntity.ok(count);
    }
}