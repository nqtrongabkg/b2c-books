package com.microservices.storeservices.service.impl;

import com.microservices.storeservices.entity.Favorite;
import com.microservices.storeservices.payload.request.FavoriteRequest;
import com.microservices.storeservices.payload.response.FavoriteResponse;
import com.microservices.storeservices.repository.FavoriteRepository;
import com.microservices.storeservices.service.FavoriteService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public FavoriteResponse create(FavoriteRequest favoriteRequest) {
        Favorite favorite = new Favorite();
        mapRequestToEntity(favoriteRequest, favorite);
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return mapFavoriteToResponse(savedFavorite);
    }

    @Override
    public FavoriteResponse getById(UUID id) {
        Favorite favorite = favoriteRepository.findById(id).orElse(null);
        if (favorite != null) {
            return mapFavoriteToResponse(favorite);
        }
        return null;
    }

    @Override
    public List<FavoriteResponse> getAll() {
        List<Favorite> favorites = favoriteRepository.findAll();
        return favorites.stream()
                .map(this::mapFavoriteToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FavoriteResponse update(UUID id, FavoriteRequest favoriteRequest) {
        Favorite existingFavorite = favoriteRepository.findById(id).orElse(null);
        if (existingFavorite != null) {
            mapRequestToEntity(favoriteRequest, existingFavorite);
            Favorite updatedFavorite = favoriteRepository.save(existingFavorite);
            return mapFavoriteToResponse(updatedFavorite);
        }
        return null;
    }

    @Override
    public FavoriteResponse delete(UUID id) {
        Favorite favorite = favoriteRepository.findById(id).orElse(null);
        if (favorite != null) {
            favoriteRepository.delete(favorite);
            return mapFavoriteToResponse(favorite);
        }
        return null;
    }

    @Override
    public List<FavoriteResponse> getByProductId(UUID productId) {
        List<Favorite> favorites = favoriteRepository.findByProductId(productId);
        return favorites.stream()
                .map(this::mapFavoriteToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FavoriteResponse> getByUserId(UUID userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        return favorites.stream()
                .map(this::mapFavoriteToResponse)
                .collect(Collectors.toList());
    }

    private FavoriteResponse mapFavoriteToResponse(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .productId(favorite.getProductId())
                .userId(favorite.getUserId())
                .build();
    }

    private void mapRequestToEntity(FavoriteRequest favoriteRequest, Favorite favorite) {
        BeanUtils.copyProperties(favoriteRequest, favorite);
    }
}
