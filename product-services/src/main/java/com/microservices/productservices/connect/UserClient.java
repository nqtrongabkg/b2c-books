package com.microservices.productservices.connect;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.microservices.productservices.payload.response.UserResponse;

@FeignClient(value = "USER-SERVICES", url = "http://localhost:9191")
public interface UserClient {
    @GetMapping(value = "/user-services/api/users/get-user-for-brand/{id}")
    UserResponse getUserById(@PathVariable("id") UUID id);
}