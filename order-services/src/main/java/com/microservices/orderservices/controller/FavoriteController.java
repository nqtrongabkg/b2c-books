package com.microservices.orderservices.controller;

import com.microservices.orderservices.payload.request.FavoriteRequest;
import com.microservices.orderservices.payload.response.FavoriteResponse;
import com.microservices.orderservices.service.FavoriteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/order-services/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/create")
    public ResponseEntity<FavoriteResponse> createFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse createdFavorite = favoriteService.create(favoriteRequest);
        return new ResponseEntity<>(createdFavorite, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<FavoriteResponse> getFavoriteById(@PathVariable UUID id) {
        FavoriteResponse favorite = favoriteService.getById(id);
        if (favorite != null) {
            return ResponseEntity.ok(favorite);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<FavoriteResponse>> getAllFavorites() {
        List<FavoriteResponse> favorites = favoriteService.getAll();
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<FavoriteResponse>> getFavoritesByUser(@PathVariable UUID userId) {
        List<FavoriteResponse> favorites = favoriteService.getByUserId(userId);
        return ResponseEntity.ok(favorites);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<FavoriteResponse> deleteFavorite(@PathVariable UUID id) {
        FavoriteResponse deletedFavorite = favoriteService.delete(id);
        if (deletedFavorite != null) {
            return ResponseEntity.ok(deletedFavorite);
        }
        return ResponseEntity.notFound().build();
    }
}
