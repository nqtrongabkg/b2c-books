package com.microservices.userservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.microservices.userservices.entity.User;

import lombok.Data;

@Data
public class NotificationResponse {

    private UUID id;

    private User user;

    private String description;

    private String detail;

    private int statusOfSee;

    private String linkTo;

    private LocalDateTime createdAt;

    private int status;
}
