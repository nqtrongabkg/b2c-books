package com.microservices.configservices.controller;

import com.microservices.configservices.payload.request.BannerRequest;
import com.microservices.configservices.payload.request.SetImageRequest;
import com.microservices.configservices.payload.response.BannerResponse;
import com.microservices.configservices.service.BannerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/config-services/api/banners")
@CrossOrigin(origins = { "http://localhost:3000" })
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @PostMapping("/create")
    public ResponseEntity<BannerResponse> createBanner(@RequestBody BannerRequest bannerRequest) {
        BannerResponse createdBanner = bannerService.create(bannerRequest);
        return new ResponseEntity<>(createdBanner, HttpStatus.CREATED);
    }

    @PutMapping("/set-image")
    public ResponseEntity<Void> setImage(@RequestBody SetImageRequest setImageRequest) {
        bannerService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        bannerService.switchStatus(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        bannerService.trash(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/display/{id}")
    public ResponseEntity<Void> display(@PathVariable UUID id) {
        bannerService.isDisplay(id);
        return ResponseEntity.ok().build();
    }  

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<BannerResponse> getBannerById(@PathVariable UUID id) {
        BannerResponse banner = bannerService.getById(id);
        if (banner != null) {
            return ResponseEntity.ok(banner);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<BannerResponse>> getAllBanners() {
        List<BannerResponse> banners = bannerService.getAll();
        return ResponseEntity.ok(banners);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BannerResponse> updateBanner(@PathVariable UUID id, @RequestBody BannerRequest bannerRequest) {
        BannerResponse updatedBanner = bannerService.update(id, bannerRequest);
        if (updatedBanner != null) {
            return ResponseEntity.ok(updatedBanner);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<BannerResponse> deleteBanner(@PathVariable UUID id) {
        BannerResponse deletedBanner = bannerService.delete(id);
        if (deletedBanner != null) {
            return ResponseEntity.ok(deletedBanner);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-display")
    public ResponseEntity<List<BannerResponse>> getDisplayBanners() {
        List<BannerResponse> banners = bannerService.getDisplay();
        return ResponseEntity.ok(banners);
    }
}