package com.microservices.userservices.controller;

import com.microservices.userservices.payload.request.AuthRequest;
import com.microservices.userservices.payload.request.ImageRequest;
import com.microservices.userservices.payload.request.PathRequest;
import com.microservices.userservices.payload.request.SetImageRequest;
import com.microservices.userservices.payload.request.UserRequest;
import com.microservices.userservices.payload.response.AuthenticationResponse;
import com.microservices.userservices.payload.response.UserResponse;
import com.microservices.userservices.payload.response.UserToOrthersResponse;
import com.microservices.userservices.service.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("user-services/api/users")
@CrossOrigin(origins = { "http://localhost:3000" })
public class UserController {

    private final UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    

    @PostMapping("/create")
    public ResponseEntity<UserResponse> createUser(
            @RequestPart("userRequest") UserRequest userRequest,
            @RequestPart("avatar") MultipartFile imageFile) {
        UserResponse createdUser = userService.create(userRequest, imageFile);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/create-user")
    public ResponseEntity<UserResponse> create(@RequestBody UserRequest userRequest) {
        UserResponse createdUser = userService.createUser(userRequest);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @RequestBody UserRequest userRequest) {
        UserResponse updatedUser = userService.update(id, userRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/update-to-store/{id}")
    public ResponseEntity<UserResponse> updateUserToStore(
            @PathVariable UUID id) {
        UserResponse updatedUser = userService.updateToStore(id);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/save-image/{id}")
    public ResponseEntity<String> saveImage(@PathVariable UUID id, 
    @RequestPart("path") PathRequest path,
        @RequestPart("image") MultipartFile image) {
            String filename = userService.saveImage(id,path, image);
            return ResponseEntity.ok(filename);
    }

    @DeleteMapping("/delete-image")
    public ResponseEntity<String> deleteImage(@RequestBody ImageRequest request) {
        try {
            userService.deleteImage(request.getPath(), request.getFilename());
            return ResponseEntity.ok("Image deleted successfully");
        } catch (Exception e) {
            throw new RuntimeException("Error deleting the file: " + e.getMessage());
        }
    }
    @PutMapping("/set-image")
    public ResponseEntity<String> setImage(@RequestBody SetImageRequest setImageRequest) {
        userService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok("Set image done");
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/get-customers")
    public ResponseEntity<List<UserResponse>> getCustomers() {
        List<UserResponse> users = userService.getCustomers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/get-staffs")
    public ResponseEntity<List<UserResponse>> getStaffs() {
        List<UserResponse> users = userService.getStaffs();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<UserResponse> deleteUser(@PathVariable UUID id) {
        UserResponse deletedUser = userService.delete(id);
        return ResponseEntity.ok(deletedUser);
    }

    @GetMapping("/get-user-for-brand/{id}")
    public ResponseEntity<UserToOrthersResponse> getUserForBrand(@PathVariable UUID id) {
        UserToOrthersResponse userForBrand = userService.getUserForBrand(id);
        return ResponseEntity.ok(userForBrand);
    }

    @PostMapping("/token")
    public AuthenticationResponse getToken(@RequestBody AuthRequest authRequest) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        if (authenticate.isAuthenticated()) {
            return userService.generateToken(authRequest.getUsername());
        } else {
            throw new RuntimeException("invalid access");
        }
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        userService.validateToken(token);
        return "Token is valid";
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        userService.switchStatus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        userService.trash(id);
        return ResponseEntity.ok().build();
    }
}
