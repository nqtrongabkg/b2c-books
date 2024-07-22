package com.microservices.userservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import com.microservices.userservices.entity.Role;
import lombok.Data;

@Data
public class UserResponse {

    private UUID id;

    private Role role;

    private String name;

    private String userName;

    private String email;

    private String password;

    private String phone;

    private String avatar;

    private String address;

    private LocalDateTime birthday;

    private LocalDateTime createdAt; 

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;
}
