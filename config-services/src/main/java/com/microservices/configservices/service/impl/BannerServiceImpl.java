package com.microservices.configservices.service.impl;

import com.microservices.configservices.entity.Banner;
import com.microservices.configservices.payload.request.BannerRequest;
import com.microservices.configservices.payload.response.BannerResponse;
import com.microservices.configservices.repository.BannerRepository;
import com.microservices.configservices.service.BannerService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    public BannerServiceImpl(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @Override
    public BannerResponse create(BannerRequest bannerRequest) {
        Banner banner = new Banner();
        mapRequestToEntity(bannerRequest, banner);
        banner.setCreatedAt(LocalDateTime.now());
        Banner savedBanner = bannerRepository.save(banner);
        return mapBannerToBannerResponse(savedBanner);
    }

    @Override
    public void setImage(UUID id, String image) {
        Banner banner = bannerRepository.findById(id).orElse(null);
        banner.setImage(image);
        bannerRepository.save(banner);
    }

    @Override
    public void switchStatus(UUID id) {
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        int currentStatus = banner.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        banner.setStatus(newStatus);
        bannerRepository.save(banner);
    }

    @Override
    public void trash(UUID id) {
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        banner.setStatus(2);
        bannerRepository.save(banner);
    }

    @Override
    public void isDisplay(UUID id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

         // Chuyển đổi giá trị của status
         int currentStatus = banner.getStatus();
         int newStatus = (currentStatus == 3) ? 1 : 3;
         banner.setStatus(newStatus);
         // Lưu trạng thái đã chuyển đổi
         bannerRepository.save(banner);
    }

    @Override
    public BannerResponse getById(UUID id) {
        Banner banner = bannerRepository.findById(id).orElse(null);
        if (banner != null) {
            return mapBannerToBannerResponse(banner);
        }
        return null;
    }

    @Override
    public List<BannerResponse> getAll() {
        List<Banner> banners = bannerRepository.findAll();
        return banners.stream()
                .map(this::mapBannerToBannerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BannerResponse update(UUID id, BannerRequest bannerRequest) {
        Banner existingBanner = bannerRepository.findById(id).orElse(null);
        if (existingBanner != null) {
            mapRequestToEntity(bannerRequest, existingBanner);
            existingBanner.setUpdatedAt(LocalDateTime.now());
            Banner updatedBanner = bannerRepository.save(existingBanner);
            return mapBannerToBannerResponse(updatedBanner);
        }
        return null;
    }

    @Override
    public BannerResponse delete(UUID id) {
        Banner banner = bannerRepository.findById(id).orElse(null);
        if (banner != null) {
            bannerRepository.delete(banner);
            return mapBannerToBannerResponse(banner);
        }
        return null;
    }

    @Override
    public List<BannerResponse> getDisplay() {
        List<Banner> banners = bannerRepository.findByStatus(3);
        return banners.stream()
                .map(this::mapBannerToBannerResponse)
                .collect(Collectors.toList());
    }

    private BannerResponse mapBannerToBannerResponse(Banner banner) {
        if (banner != null) {
            return BannerResponse.builder()
                    .id(banner.getId())
                    .name(banner.getName())
                    .image(banner.getImage())
                    .description(banner.getDescription())
                    .createdAt(banner.getCreatedAt())
                    .updatedAt(banner.getUpdatedAt())
                    .createdBy(banner.getCreatedBy())
                    .updatedBy(banner.getUpdatedBy())
                    .status(banner.getStatus())
                    .build();
        }
        return null;
    }


    private void mapRequestToEntity(BannerRequest bannerRequest, Banner banner) {
        BeanUtils.copyProperties(bannerRequest, banner);
    }
}
