package com.microservices.userservices.service;

import java.util.List;
import java.util.UUID;

import com.microservices.userservices.payload.request.RoleRequest;
import com.microservices.userservices.payload.response.RoleResponse;

public interface RoleService {

    RoleResponse create(RoleRequest roleRequest);

    RoleResponse getById(UUID id);

    List<RoleResponse> getAll();
    
    RoleResponse update(UUID id, RoleRequest roleRequest);

    RoleResponse delete(UUID id);

    void switchStatus(UUID id);

    void trash(UUID id);

    RoleResponse getByRole(int role);
}
