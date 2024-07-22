package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.OptionValue;
import com.microservices.productservices.entity.Option;
import com.microservices.productservices.payload.request.OptionRequest;
import com.microservices.productservices.payload.response.OptionResponse;
import com.microservices.productservices.repository.OptionRepository;
import com.microservices.productservices.repository.OptionValueRepository;
import com.microservices.productservices.service.OptionService;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OptionServiceImpl implements OptionService {

    private final OptionRepository optionRepository;
    private final OptionValueRepository optionValueRepository;

    public OptionServiceImpl(OptionRepository optionRepository, OptionValueRepository optionValueRepository) {
        this.optionRepository = optionRepository;
        this.optionValueRepository = optionValueRepository;
    }

    @Override
    public OptionResponse create(OptionRequest optionRequest) {
        Option option = new Option();
        mapRequestToEntity(optionRequest, option);
        option.setCreatedAt(LocalDateTime.now());
        Option savedOption = optionRepository.save(option);

        List<OptionValue> optionValues = new ArrayList<>();
        for (String value : optionRequest.getValues()) {
            OptionValue optionValue = new OptionValue();
            optionValue.setOptionId(savedOption.getId());
            optionValue.setValue(value);
            optionValues.add(optionValue);
        }
        optionValueRepository.saveAll(optionValues);

        return mapOptionToResponse(savedOption);
    }

    @Override
    public OptionResponse getById(UUID id) {
        Option option = optionRepository.findById(id).orElse(null);
        if (option != null) {
            return mapOptionToResponse(option);
        }
        return null;
    }

    @Override
    public List<OptionResponse> getByProductId(UUID productId) {
        List<Option> options = optionRepository.findByProductId(productId);
        return options.stream()
                .map(this::mapOptionToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OptionResponse> getAll() {
        List<Option> options = optionRepository.findAll();
        return options.stream()
                .map(this::mapOptionToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OptionResponse> findByUser(UUID id) {
        List<Option> options = optionRepository.findByCreatedBy(id);
        return options.stream()
                .map(this::mapOptionToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OptionResponse update(UUID id, OptionRequest optionRequest) {
        Option existingOption = optionRepository.findById(id).orElse(null);
        if (existingOption != null) {
            mapRequestToEntity(optionRequest, existingOption);
            existingOption.setUpdatedAt(LocalDateTime.now());
            Option updatedOption = optionRepository.save(existingOption);

            // Xóa tất cả các OptionValue cũ
            List<OptionValue> existingOptionValues = optionValueRepository.findByOptionId(id);
            optionValueRepository.deleteAll(existingOptionValues);

            // Tạo lại các OptionValue mới từ danh sách giá trị mới
            List<OptionValue> optionValues = new ArrayList<>();
            for (String value : optionRequest.getValues()) {
                OptionValue optionValue = new OptionValue();
                optionValue.setOptionId(updatedOption.getId());
                optionValue.setValue(value);
                optionValues.add(optionValue);
            }
            optionValueRepository.saveAll(optionValues);

            return mapOptionToResponse(updatedOption);
        }
        return null;
    }

    @Override
    public OptionResponse delete(UUID id) {
        Option option = optionRepository.findById(id).orElse(null);
        OptionResponse optionResponse = mapOptionToResponse(option);
        if (option != null) {
            List<OptionValue> optionValues = optionValueRepository.findByOptionId(id);
            optionValueRepository.deleteAll(optionValues);
            optionRepository.delete(option);
            return optionResponse;
        }
        return null;
    }

    @Override
    public void switchStatus(UUID id) {
        Option option = optionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = option.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        option.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        optionRepository.save(option);
    }

    @Override
    public void trash(UUID id) {
        Option option = optionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Đặt trạng thái thành 2
        option.setStatus(2);

        // Lưu trạng thái đã thay đổi
        optionRepository.save(option);
    }

    private OptionResponse mapOptionToResponse(Option option) {
        List<OptionValue> values = optionValueRepository.findByOptionId(option.getId());
        return OptionResponse.builder()
                .id(option.getId())
                .productId(option.getProductId())
                .name(option.getName())
                .description(option.getDescription())
                .createdAt(option.getCreatedAt())
                .updatedAt(option.getUpdatedAt())
                .createdBy(option.getCreatedBy())
                .updatedBy(option.getUpdatedBy())
                .status(option.getStatus())
                .values(values)
                .build();
    }

    private void mapRequestToEntity(OptionRequest optionRequest, Option option) {
        BeanUtils.copyProperties(optionRequest, option);
    }
}
