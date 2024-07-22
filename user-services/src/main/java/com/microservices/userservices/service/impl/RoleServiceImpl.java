package com.microservices.userservices.service.impl;

import com.microservices.userservices.entity.Role;
import com.microservices.userservices.exception.CustomException;
import com.microservices.userservices.payload.request.RoleRequest;
import com.microservices.userservices.payload.response.RoleResponse;
import com.microservices.userservices.repository.RoleRepository;
import com.microservices.userservices.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public RoleResponse create(RoleRequest roleRequest) {
        Role role = new Role();
        role.setName(roleRequest.getName());
        role.setDescription(roleRequest.getDescription());
        role.setRole(roleRequest.getRole());
        role.setStatus(roleRequest.getStatus());

        Role savedRole = roleRepository.save(role);
        return convertToResponse(savedRole);
    }

    @Override
    public RoleResponse getById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));
        return convertToResponse(role);
    }

    @Override
    public List<RoleResponse> getAll() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse update(UUID id, RoleRequest roleRequest) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));

        role.setName(roleRequest.getName());
        role.setDescription(roleRequest.getDescription());
        role.setRole(roleRequest.getRole());
        role.setStatus(roleRequest.getStatus());

        Role updatedRole = roleRepository.save(role);
        return convertToResponse(updatedRole);
    }

    @Override
    public RoleResponse delete(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));
        roleRepository.delete(role);
        return convertToResponse(role);
    }

    @Override
    public void switchStatus(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = role.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        role.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        roleRepository.save(role);
    }

    @Override
    public void trash(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));

        // Đặt trạng thái thành 2
        role.setStatus(2);

        // Lưu trạng thái đã thay đổi
        roleRepository.save(role);
    }

    @Override
    public RoleResponse getByRole(int role) {
        Role roleEntity = roleRepository.findFirstByRole(role)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));
        return convertToResponse(roleEntity);
    }

    private RoleResponse convertToResponse(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setName(role.getName());
        response.setDescription(role.getDescription());
        response.setRole(role.getRole());
        response.setStatus(role.getStatus());
        return response;
    }
}
