package com.microservices.storeservices.service;

import com.microservices.storeservices.payload.request.FavoriteRequest;
import com.microservices.storeservices.payload.response.FavoriteResponse;
import java.util.List;
import java.util.UUID;

public interface FavoriteService {

    FavoriteResponse create(FavoriteRequest favoriteRequest);

    FavoriteResponse getById(UUID id);

    List<FavoriteResponse> getAll();

    FavoriteResponse update(UUID id, FavoriteRequest favoriteRequest);

    FavoriteResponse delete(UUID id);

    List<FavoriteResponse> getByProductId(UUID productId);

    List<FavoriteResponse> getByUserId(UUID userId);
}
