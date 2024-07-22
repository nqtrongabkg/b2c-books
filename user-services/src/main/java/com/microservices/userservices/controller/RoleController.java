package com.microservices.userservices.controller;

import com.microservices.userservices.payload.request.RoleRequest;
import com.microservices.userservices.payload.response.RoleResponse;
import com.microservices.userservices.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("user-services/api/roles")
@CrossOrigin(origins = { "http://localhost:3000" })
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/create")
    public ResponseEntity<RoleResponse> createRole(@RequestBody RoleRequest role) {
        RoleResponse createdRole = roleService.create(role);
        return new ResponseEntity<>(createdRole, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable UUID id) {
        RoleResponse role = roleService.getById(id);
        return ResponseEntity.ok(role);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAll();
        return ResponseEntity.ok(roles);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RoleResponse> updateRole(@RequestBody RoleRequest roleRequest, @PathVariable UUID id) {
        RoleResponse updatedRole = roleService.update(id, roleRequest);
        return ResponseEntity.ok(updatedRole);
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        roleService.switchStatus(id);
        return ResponseEntity.ok().build();
    }   
    
    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        roleService.trash(id);
        return ResponseEntity.ok().build();
    }    

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<RoleResponse> deleteRole(@PathVariable UUID id) {
        RoleResponse deletedRole = roleService.delete(id);
        return ResponseEntity.ok(deletedRole);
    }

    @GetMapping("/get-by-role/{role}")
    public ResponseEntity<RoleResponse> getRoleByRole(@PathVariable int role) {
        RoleResponse roleResponse = roleService.getByRole(role);
        return ResponseEntity.ok(roleResponse);
    }
}
