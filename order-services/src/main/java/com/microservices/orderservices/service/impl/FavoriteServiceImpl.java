package com.microservices.orderservices.service.impl;

import com.microservices.orderservices.entity.Favorite;
import com.microservices.orderservices.payload.request.FavoriteRequest;
import com.microservices.orderservices.payload.response.FavoriteResponse;
import com.microservices.orderservices.repository.FavoriteRepository;
import com.microservices.orderservices.service.FavoriteService;
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
        return mapFavoriteToResponse(favorite);
    }

    @Override
    public List<FavoriteResponse> getByUserId(UUID userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        return favorites.stream()
                .map(this::mapFavoriteToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FavoriteResponse> getAll() {
        List<Favorite> favorites = favoriteRepository.findAll();
        return favorites.stream()
                .map(this::mapFavoriteToResponse)
                .collect(Collectors.toList());
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

    private FavoriteResponse mapFavoriteToResponse(Favorite favorite) {
        if (favorite != null) {
            return FavoriteResponse.builder()
                    .id(favorite.getId())
                    .productId(favorite.getProductId())
                    .userId(favorite.getUserId())
                    .build();
        }
        return null;
    }

    private void mapRequestToEntity(FavoriteRequest favoriteRequest, Favorite favorite) {
        BeanUtils.copyProperties(favoriteRequest, favorite);
    }
}
