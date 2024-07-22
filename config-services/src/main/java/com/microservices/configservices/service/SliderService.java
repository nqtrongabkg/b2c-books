package com.microservices.configservices.service;

import java.util.List;
import java.util.UUID;
import com.microservices.configservices.payload.request.SliderRequest;
import com.microservices.configservices.payload.response.SliderResponse;

public interface SliderService {

    SliderResponse create(SliderRequest SliderRequest);

    void setImage(UUID id, String image);

    void switchStatus(UUID id);

    void trash(UUID id);

    void isDisplay(UUID id);

    SliderResponse getById(UUID id);

    List<SliderResponse> getAll();

    SliderResponse update(UUID id, SliderRequest SliderRequest);

    SliderResponse delete(UUID id);

}
