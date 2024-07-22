package com.microservices.userservices.service.impl;

import com.microservices.userservices.entity.Role;
import com.microservices.userservices.entity.User;
import com.microservices.userservices.exception.CustomException;
import com.microservices.userservices.payload.request.PathRequest;
import com.microservices.userservices.payload.request.UserRequest;
import com.microservices.userservices.payload.response.AuthenticationResponse;
import com.microservices.userservices.payload.response.UserResponse;
import com.microservices.userservices.payload.response.UserToOrthersResponse;
import com.microservices.userservices.repository.RoleRepository;
import com.microservices.userservices.repository.UserRepository;
import com.microservices.userservices.service.JwtService;
import com.microservices.userservices.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public UserResponse create(UserRequest userRequest, MultipartFile avatar) {
        if (userRepository.findByUserName(userRequest.getUserName()).isPresent()) {
            throw new CustomException("User name already exists", "USER_EXISTS");
        }
        User user = new User();
        mapRequestToEntity(userRequest, user);
        user.setCreatedAt(LocalDateTime.now());

        // Hash password
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        // Save avatar if provided
        if (avatar != null) {
            String avatarFileName = saveAvatar(avatar);
            user.setAvatar(avatarFileName);
        }

        User savedUser = userRepository.save(user);
        return mapEntityToResponse(savedUser);
    }

    @Override
    public void setImage(UUID id, String image) {
        User user = userRepository.findById(id).orElse(null);
        user.setAvatar(image);
        userRepository.save(user);
    }

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        User user = new User();
        mapRequestToEntity(userRequest, user);
        user.setCreatedAt(LocalDateTime.now());
        // Hash password
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        User savedUser = userRepository.save(user);
        return mapEntityToResponse(savedUser);
    }

    @Override
    public String saveImage(UUID id, PathRequest path, MultipartFile image) {
        String fileName = id.toString() + "-" + image.getOriginalFilename();
        try {
            // Lưu tệp vào thư mục tĩnh của ứng dụng
            Path filePath = Paths.get("src/main/resources/static/" + path.getPath() + "/" + fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new CustomException("Failed to save image file", "INTERNAL_SERVER_ERROR");
        }
        return fileName;
    }

    @Override
    public void deleteImage(String path, String fileName) {
        try {
            Path filePath = Paths.get("src/main/resources/static/" + path + "/" + fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new CustomException("Failed to delete old avatar", "INTERNAL_SERVER_ERROR");
        }
    }

    @Override
    public UserResponse update(UUID id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found", "NOT_FOUND"));
        mapRequestToEntity(userRequest, user);
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        return mapEntityToResponse(savedUser);
    }

    @Override
    public UserResponse updateToStore(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found", "NOT_FOUND"));
        Role role = roleRepository.findFirstByRole(2)
                .orElseThrow(() -> new CustomException("Role not found", "ROLE_NOT_FOUND"));
        user.setUpdatedAt(LocalDateTime.now());
        user.setRole(role);
        User savedUser = userRepository.save(user);
        return mapEntityToResponse(savedUser);
    }

    private String saveAvatar(MultipartFile avatar) {
        String fileName = UUID.randomUUID().toString() + "-" + avatar.getOriginalFilename();
        try {
            // Lưu tệp vào thư mục tĩnh của ứng dụng
            Path filePath = Paths.get("src/main/resources/static/users/" + fileName);
            Files.copy(avatar.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new CustomException("Failed to save avatar file", "INTERNAL_SERVER_ERROR");
        }
        return fileName;
    }

    @Override
    public UserResponse getByUsername(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new CustomException("User not found", "NOT_FOUND"));
        return mapEntityToResponse(user);
    }

    @Override
    public UserResponse getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found", "NOT_FOUND"));
        return mapEntityToResponse(user);
    }

    @Override
    public List<UserResponse> getAll() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getCustomers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getRole().getRole() != 1)
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getStaffs() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getRole().getRole() == 1)
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse delete(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found", "NOT_FOUND"));
        userRepository.delete(user);
        return mapEntityToResponse(user);
    }

    @Override
    public UserToOrthersResponse getUserForBrand(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found", "NOT_FOUND"));
        return mapUserToBrandResponse(user);
    }

    private void mapRequestToEntity(UserRequest userRequest, User user) {
        BeanUtils.copyProperties(userRequest, user);
    }

    private UserResponse mapEntityToResponse(User user) {
        UserResponse userResponse = new UserResponse();
        BeanUtils.copyProperties(user, userResponse);
        return userResponse;
    }

    private UserToOrthersResponse mapUserToBrandResponse(User user) {
        UserToOrthersResponse userToBrandResponse = new UserToOrthersResponse();
        BeanUtils.copyProperties(user, userToBrandResponse);
        return userToBrandResponse;
    }

    public AuthenticationResponse generateToken(String username) {
        String token = jwtService.generateToken(username);
        if (!token.isEmpty()) {
            User user = userRepository.findByUserName(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            AuthenticationResponse response = new AuthenticationResponse();
            response.setUserId(user.getId());
            response.setToken(token);
            return response;
        } else {
            throw new RuntimeException("Failed to generate token");
        }
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    @Override
    public void switchStatus(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("user not found", "USER_NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = user.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        user.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        userRepository.save(user);
    }

    @Override
    public void trash(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found", "USER_NOT_FOUND"));

        // Đặt trạng thái thành 2
        user.setStatus(2);

        // Lưu trạng thái đã thay đổi
        userRepository.save(user);
    }
}
