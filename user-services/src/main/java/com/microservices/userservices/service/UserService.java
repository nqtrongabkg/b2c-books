package com.microservices.userservices.service;

import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

import com.microservices.userservices.payload.request.PathRequest;
import com.microservices.userservices.payload.request.UserRequest;
import com.microservices.userservices.payload.response.AuthenticationResponse;
import com.microservices.userservices.payload.response.UserResponse;
import com.microservices.userservices.payload.response.UserToOrthersResponse;

public interface UserService {

    UserResponse create(UserRequest userRequest, MultipartFile avatar);

    void setImage(UUID id, String image);

    UserResponse createUser(UserRequest userRequest);

    String saveImage(UUID id, PathRequest path, MultipartFile avatar);

    void deleteImage(String path, String fileName);

    UserResponse getById(UUID id);

    UserResponse getByUsername(String userName);

    List<UserResponse> getAll();

    List<UserResponse> getCustomers();

    List<UserResponse> getStaffs();
    
    UserResponse update(UUID id, UserRequest userRequest);

    UserResponse delete(UUID id);

    UserToOrthersResponse getUserForBrand(UUID id);

    AuthenticationResponse generateToken(String username);

    void validateToken(String token);

    void switchStatus(UUID id);

    void trash(UUID id);

    UserResponse updateToStore(UUID id);
}
