package com.microservices.userservices.payload.request;

import com.microservices.userservices.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {

    private User user;

    private String description;

    private String detail;

    private int statusOfSee;

    private String linkTo;

    private int status;
}
