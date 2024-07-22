package com.microservices.configservices.service;

import java.util.List;
import java.util.UUID;
import com.microservices.configservices.payload.request.BannerRequest;
import com.microservices.configservices.payload.response.BannerResponse;


public interface BannerService {

    BannerResponse create(BannerRequest BannerRequest);

    void setImage(UUID id, String image);

    void switchStatus(UUID id);

    void trash(UUID id);

    void isDisplay(UUID id);

    BannerResponse getById(UUID id);

    List<BannerResponse> getAll();

    BannerResponse update(UUID id, BannerRequest BannerRequest);

    BannerResponse delete(UUID id);

    List<BannerResponse> getDisplay(); 
}
