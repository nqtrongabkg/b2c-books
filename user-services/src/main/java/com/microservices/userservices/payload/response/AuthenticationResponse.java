package com.microservices.userservices.payload.response;

import java.util.UUID;

import lombok.Data;

@Data
public class AuthenticationResponse {

    private UUID userId;

    private String token;
}