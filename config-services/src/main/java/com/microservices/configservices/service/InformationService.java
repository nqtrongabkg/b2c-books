package com.microservices.configservices.service;

import java.util.List;
import java.util.UUID;

import com.microservices.configservices.payload.request.InformationRequest;

import com.microservices.configservices.payload.response.InfomationsResponse;


public interface InformationService {

    InfomationsResponse create(InformationRequest InformationRequest);

    void setImage(UUID id, String image);

    void switchStatus(UUID id);

    void trash(UUID id);

    InfomationsResponse getById(UUID id);

    List<InfomationsResponse> getAll();

    InfomationsResponse update(UUID id, InformationRequest InformationRequest);

    InfomationsResponse delete(UUID id);

    void isDisplay(UUID id);

    InfomationsResponse getInformationDisplay();
}
