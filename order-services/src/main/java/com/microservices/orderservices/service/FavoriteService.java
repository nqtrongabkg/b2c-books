package com.microservices.orderservices.service;

import com.microservices.orderservices.payload.request.FavoriteRequest;
import com.microservices.orderservices.payload.response.FavoriteResponse;

import java.util.List;
import java.util.UUID;

public interface FavoriteService {

    FavoriteResponse create(FavoriteRequest favoriteRequest);

    FavoriteResponse getById(UUID id);

    List<FavoriteResponse> getByUserId(UUID userId);

    List<FavoriteResponse> getAll();

    FavoriteResponse delete(UUID id);

}
