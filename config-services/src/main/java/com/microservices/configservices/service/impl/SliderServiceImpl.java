package com.microservices.configservices.service.impl;

import com.microservices.configservices.entity.Slider;
import com.microservices.configservices.payload.request.SliderRequest;
import com.microservices.configservices.payload.response.SliderResponse;
import com.microservices.configservices.repository.SliderRepository;
import com.microservices.configservices.service.SliderService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SliderServiceImpl implements SliderService {

    private final SliderRepository sliderRepository;

    public SliderServiceImpl(SliderRepository sliderRepository) {
        this.sliderRepository = sliderRepository;
    }

    @Override
    public SliderResponse create(SliderRequest sliderRequest) {
        Slider slider = new Slider();
        mapRequestToEntity(sliderRequest, slider);
        slider.setCreatedAt(LocalDateTime.now());
        Slider savedSlider = sliderRepository.save(slider);
        return mapSliderToSliderResponse(savedSlider);
    }

    @Override
    public void setImage(UUID id, String image) {
        Slider slider = sliderRepository.findById(id).orElse(null);
        slider.setImage(image);
        sliderRepository.save(slider);
    }

    @Override
    public void switchStatus(UUID id) {
        Slider slider = sliderRepository.findById(id).orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        // Toggle the status value
        int currentStatus = slider.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        slider.setStatus(newStatus);
        sliderRepository.save(slider);
    }

    @Override
    public void trash(UUID id) {
        Slider slider = sliderRepository.findById(id).orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        // Set status to 2 (indicating trashed)
        slider.setStatus(2);
        sliderRepository.save(slider);
    }

    @Override
    public void isDisplay(UUID id) {
        Slider lSlider = sliderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

         // Chuyển đổi giá trị của status
         int currentStatus = lSlider.getStatus();
         int newStatus = (currentStatus == 3) ? 1 : 3;
         lSlider.setStatus(newStatus);
         // Lưu trạng thái đã chuyển đổi
         sliderRepository.save(lSlider);
    }

    @Override
    public SliderResponse getById(UUID id) {
        Slider slider = sliderRepository.findById(id).orElse(null);
        if (slider != null) {
            return mapSliderToSliderResponse(slider);
        }
        return null;
    }

    @Override
    public List<SliderResponse> getAll() {
        List<Slider> sliders = sliderRepository.findAll();
        return sliders.stream()
                .map(this::mapSliderToSliderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SliderResponse update(UUID id, SliderRequest sliderRequest) {
        Slider existingSlider = sliderRepository.findById(id).orElse(null);
        if (existingSlider != null) {
            mapRequestToEntity(sliderRequest, existingSlider);
            existingSlider.setUpdatedAt(LocalDateTime.now());
            Slider updatedSlider = sliderRepository.save(existingSlider);
            return mapSliderToSliderResponse(updatedSlider);
        }
        return null;
    }

    @Override
    public SliderResponse delete(UUID id) {
        Slider slider = sliderRepository.findById(id).orElse(null);
        if (slider != null) {
            sliderRepository.delete(slider);
            return mapSliderToSliderResponse(slider);
        }
        return null;
    }

    private SliderResponse mapSliderToSliderResponse(Slider slider) {
        if (slider != null) {
            return SliderResponse.builder()
                    .id(slider.getId())
                    .name(slider.getName())
                    .image(slider.getImage())
                    .description(slider.getDescription())
                    .createdAt(slider.getCreatedAt())
                    .updatedAt(slider.getUpdatedAt())
                    .createdBy(slider.getCreatedBy())
                    .updatedBy(slider.getUpdatedBy())
                    .status(slider.getStatus())
                    .build();
        }
        return null;
    }

    private void mapRequestToEntity(SliderRequest sliderRequest, Slider slider) {
        BeanUtils.copyProperties(sliderRequest, slider);
    }
}
