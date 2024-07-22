package com.microservices.configservices.controller;

import com.microservices.configservices.payload.request.SetImageRequest;
import com.microservices.configservices.payload.request.SliderRequest;
import com.microservices.configservices.payload.response.SliderResponse;
import com.microservices.configservices.service.SliderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/config-services/api/sliders")
@CrossOrigin(origins = { "http://localhost:3000" })
public class SliderController {

    private final SliderService sliderService;

    public SliderController(SliderService sliderService) {
        this.sliderService = sliderService;
    }

    @PostMapping("/create")
    public ResponseEntity<SliderResponse> createSlider(@RequestBody SliderRequest sliderRequest) {
        SliderResponse createdSlider = sliderService.create(sliderRequest);
        return new ResponseEntity<>(createdSlider, HttpStatus.CREATED);
    }

    @PutMapping("/set-image")
    public ResponseEntity<Void> setImage(@RequestBody SetImageRequest setImageRequest) {
        sliderService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        sliderService.switchStatus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        sliderService.trash(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/display/{id}")
    public ResponseEntity<Void> display(@PathVariable UUID id) {
        sliderService.isDisplay(id);
        return ResponseEntity.ok().build();
    }  

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<SliderResponse> getSliderById(@PathVariable UUID id) {
        SliderResponse slider = sliderService.getById(id);
        if (slider != null) {
            return ResponseEntity.ok(slider);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<SliderResponse>> getAllSliders() {
        List<SliderResponse> sliders = sliderService.getAll();
        return ResponseEntity.ok(sliders);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SliderResponse> updateSlider(@PathVariable UUID id, @RequestBody SliderRequest sliderRequest) {
        SliderResponse updatedSlider = sliderService.update(id, sliderRequest);
        if (updatedSlider != null) {
            return ResponseEntity.ok(updatedSlider);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<SliderResponse> deleteSlider(@PathVariable UUID id) {
        SliderResponse deletedSlider = sliderService.delete(id);
        if (deletedSlider != null) {
            return ResponseEntity.ok(deletedSlider);
        }
        return ResponseEntity.notFound().build();
    }
}