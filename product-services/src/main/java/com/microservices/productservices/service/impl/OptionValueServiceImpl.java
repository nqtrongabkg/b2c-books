package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.OptionValue;
import com.microservices.productservices.payload.request.OptionValueRequest;
import com.microservices.productservices.payload.response.OptionValueResponse;
import com.microservices.productservices.repository.OptionValueRepository;
import com.microservices.productservices.service.OptionValueService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OptionValueServiceImpl implements OptionValueService {

    private final OptionValueRepository optionValueRepository;

    public OptionValueServiceImpl(OptionValueRepository optionValueRepository) {
        this.optionValueRepository = optionValueRepository;
    }

    @Override
    public OptionValueResponse create(OptionValueRequest optionValueRequest) {
        OptionValue optionValue = new OptionValue();
        mapRequestToEntity(optionValueRequest, optionValue);
        OptionValue savedOptionValue = optionValueRepository.save(optionValue);
        return mapOptionValueToResponse(savedOptionValue);
    }

    @Override
    public OptionValueResponse getById(UUID id) {
        OptionValue optionValue = optionValueRepository.findById(id).orElse(null);
        if (optionValue != null) {
            return mapOptionValueToResponse(optionValue);
        }
        return null;
    }

    @Override
    public List<OptionValueResponse> getAll() {
        List<OptionValue> optionValues = optionValueRepository.findAll();
        return optionValues.stream()
                .map(this::mapOptionValueToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OptionValueResponse update(UUID id, OptionValueRequest optionValueRequest) {
        OptionValue existingOptionValue = optionValueRepository.findById(id).orElse(null);
        if (existingOptionValue != null) {
            mapRequestToEntity(optionValueRequest, existingOptionValue);
            OptionValue updatedOptionValue = optionValueRepository.save(existingOptionValue);
            return mapOptionValueToResponse(updatedOptionValue);
        }
        return null;
    }

    @Override
    public OptionValueResponse delete(UUID id) {
        OptionValue optionValue = optionValueRepository.findById(id).orElse(null);
        if (optionValue != null) {
            optionValueRepository.delete(optionValue);
            return mapOptionValueToResponse(optionValue);
        }
        return null;
    }

    @Override
    public List<OptionValueResponse> findByOptionId(UUID optionId) {
        List<OptionValue> optionValues = optionValueRepository.findByOptionId(optionId);
        return optionValues.stream()
                .map(this::mapOptionValueToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByOptionId(UUID optionId) {
        List<OptionValue> optionValues = optionValueRepository.findByOptionId(optionId);
        optionValueRepository.deleteAll(optionValues);
    }
    


    private OptionValueResponse mapOptionValueToResponse(OptionValue optionValue) {
        return OptionValueResponse.builder()
                .id(optionValue.getId())
                .optionId(optionValue.getOptionId())
                .value(optionValue.getValue())
                .build();
    }

    private void mapRequestToEntity(OptionValueRequest optionValueRequest, OptionValue optionValue) {
        BeanUtils.copyProperties(optionValueRequest, optionValue);
    }
}
