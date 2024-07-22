package com.microservices.productservices.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import com.microservices.productservices.payload.request.BrandRequest;
import com.microservices.productservices.payload.request.SetImageRequest;
import com.microservices.productservices.payload.response.BrandResponse;
import com.microservices.productservices.service.BrandService;
@RestController
@RequestMapping("product-services/api/brands")
@CrossOrigin(origins = { "http://localhost:3000" })
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PostMapping("/create")
    public ResponseEntity<BrandResponse> createBrand(@RequestBody BrandRequest brandRequest) {
        BrandResponse brandResponse = brandService.create(brandRequest);
        return new ResponseEntity<>(brandResponse, HttpStatus.CREATED);
    }

    @PutMapping("/set-image")
    public ResponseEntity<String> setImage(@RequestBody SetImageRequest setImageRequest) {
        brandService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok("Set image done");
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<BrandResponse> getBrandById(@PathVariable UUID id) {
        BrandResponse brand = brandService.getById(id);
        if (brand != null) {
            return ResponseEntity.ok(brand);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<BrandResponse>> getAllBrands() {
        List<BrandResponse> brands = brandService.getAll();
        return ResponseEntity.ok(brands);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BrandResponse> updateBrand(
        @PathVariable UUID id,
        @RequestBody BrandRequest brandRequest){
        BrandResponse updatedBrand = brandService.update(id, brandRequest);
        if (updatedBrand != null) {
            return ResponseEntity.ok(updatedBrand);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<BrandResponse> deleteBrand(@PathVariable UUID id) {
        BrandResponse deletedBrand = brandService.delete(id);
        if (deletedBrand != null) {
            return ResponseEntity.ok(deletedBrand);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<BrandResponse>> getBrandsByUser(@PathVariable UUID userId) {
        List<BrandResponse> brands = brandService.getBrandForClient(userId);
        return ResponseEntity.ok(brands);
    }
    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        brandService.switchStatus(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        brandService.trash(id);
        return ResponseEntity.ok().build();
    }  
    @PutMapping("/display/{id}")
    public ResponseEntity<Void> display(@PathVariable UUID id) {
        brandService.isDisplay(id);
        return ResponseEntity.ok().build();
    }  
    @PutMapping("/public/{id}")
    public ResponseEntity<Void> isPublic(@PathVariable UUID id) {
        brandService.isPublic(id);
        return ResponseEntity.ok().build();
    }  
    @GetMapping("/search/{name}")
    public ResponseEntity<List<BrandResponse>> searchProductsByName(@PathVariable String name) {
        List<BrandResponse> brands = brandService.searchByName(name);
        return ResponseEntity.ok(brands);
    }
}
