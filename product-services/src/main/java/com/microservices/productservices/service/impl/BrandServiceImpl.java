package com.microservices.productservices.service.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
// import java.io.IOException;
// import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.microservices.productservices.entity.Brand;
import com.microservices.productservices.payload.request.BrandRequest;
import com.microservices.productservices.payload.response.BrandResponse;
import com.microservices.productservices.repository.BrandRepository;
import com.microservices.productservices.service.BrandService;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public BrandResponse create(BrandRequest brandRequest) {
        Brand brand = new Brand();
        mapRequestToEntity(brandRequest, brand);
        brand.setCreatedAt(LocalDateTime.now());
        Brand savedBrand = brandRepository.save(brand);
        return mapBrandToBrandResponse(savedBrand);
    }

    @Override
    public void setImage(UUID id, String image){
        Brand brand = brandRepository.findById(id).orElse(null);
        brand.setImage(image);
        brandRepository.save(brand);
    }

    @Override
    public BrandResponse getById(UUID id) {
        Brand brand = brandRepository.findById(id).orElse(null);
        if (brand != null) {
            return mapBrandToBrandResponse(brand);
        }
        return null;
    }

    @Override
    public List<BrandResponse> getAll() {
        List<Brand> brands = brandRepository.findAll();
        return brands.stream()
                .map(this::mapBrandToBrandResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BrandResponse update(UUID id, BrandRequest brandRequest) {
        Brand existingBrand = brandRepository.findById(id).orElse(null);
        if (existingBrand != null) {
            mapRequestToEntity(brandRequest, existingBrand);
            existingBrand.setUpdatedAt(LocalDateTime.now());
            Brand updatedBrand = brandRepository.save(existingBrand);
            return mapBrandToBrandResponse(updatedBrand);
        }
        return null;
    }

    @Override
    public BrandResponse delete(UUID id) {
        Brand brand = brandRepository.findById(id).orElse(null);
        if (brand != null) {
            brandRepository.delete(brand);
            return mapBrandToBrandResponse(brand);
        }
        return null;
    }

    @Override
    public List<BrandResponse> findByUser(UUID id) {
        List<Brand> brands = brandRepository.findByCreatedBy(id);
        return brands.stream()
                .map(this::mapBrandToBrandResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void switchStatus(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = brand.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        brand.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        brandRepository.save(brand);
    }

    @Override
    public void trash(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Đặt trạng thái thành 2
        brand.setStatus(2);

        // Lưu trạng thái đã thay đổi
        brandRepository.save(brand);
    }

    @Override
    public void isDisplay(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

         // Chuyển đổi giá trị của status
         int currentStatus = brand.getStatus();
         int newStatus = (currentStatus == 3) ? 1 : 3;
         brand.setStatus(newStatus);
         // Lưu trạng thái đã chuyển đổi
         brandRepository.save(brand);
    }

    @Override
    public void isPublic(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

         // Chuyển đổi giá trị của status
         int currentStatus = brand.getStatus();
         int newStatus = (currentStatus == 4) ? 1 : 4;
         brand.setStatus(newStatus);
         // Lưu trạng thái đã chuyển đổi
         brandRepository.save(brand);
    }

    @Override
    public List<BrandResponse> getBrandForClient(UUID id) {
        List<Brand> brands = brandRepository.findByStatusOrCreatedBy(4, id);
        return brands.stream()
                .map(this::mapBrandToBrandResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BrandResponse> searchByName(String name) {
        List<Brand> brands = brandRepository.findByNameContainingIgnoreCase(name);
        return brands.stream()
                .map(this::mapBrandToBrandResponse)
                .collect(Collectors.toList());
    }

    private BrandResponse mapBrandToBrandResponse(Brand brand) {
        if (brand != null) {
            return BrandResponse.builder()
                    .id(brand.getId())
                    .name(brand.getName())
                    .description(brand.getDescription())
                    .image(brand.getImage())
                    .createdAt(brand.getCreatedAt())
                    .updatedAt(brand.getUpdatedAt())
                    .createdBy(brand.getCreatedBy())
                    .updatedBy(brand.getUpdatedBy())
                    .status(brand.getStatus())
                    .build();
        }
        return null;
    }

    private void mapRequestToEntity(BrandRequest brandRequest, Brand brand) {
        BeanUtils.copyProperties(brandRequest, brand);
    }
}
