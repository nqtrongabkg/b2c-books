package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.OptionValueRequest;
import com.microservices.productservices.payload.response.OptionValueResponse;

import java.util.List;
import java.util.UUID;

public interface OptionValueService {

    OptionValueResponse create(OptionValueRequest optionValueRequest);

    OptionValueResponse getById(UUID id);

    List<OptionValueResponse> getAll();

    OptionValueResponse update(UUID id, OptionValueRequest optionValueRequest);

    OptionValueResponse delete(UUID id);

    List<OptionValueResponse> findByOptionId(UUID optionId);

    void deleteByOptionId(UUID optionId);

}
