package com.microservices.productservices.controller;

import com.microservices.productservices.payload.request.ProductGallaryRequest;
import com.microservices.productservices.payload.request.SetImageRequest;
import com.microservices.productservices.payload.response.ProductGallaryResponse;
import com.microservices.productservices.service.ProductGallaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("product-services/api/product-galleries")
@CrossOrigin(origins = { "http://localhost:3000" })
public class ProductGallaryController {

    private final ProductGallaryService productGallaryService;

    public ProductGallaryController(ProductGallaryService productGallaryService) {
        this.productGallaryService = productGallaryService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductGallaryResponse> createProductGallary(@RequestBody ProductGallaryRequest productGallaryRequest) {
        ProductGallaryResponse createdProductGallary = productGallaryService.create(productGallaryRequest);
        return new ResponseEntity<>(createdProductGallary, HttpStatus.CREATED);
    }

    @PutMapping("/set-image")
    public ResponseEntity<String> setImage(@RequestBody SetImageRequest setImageRequest) {
        productGallaryService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok("Set image done");
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ProductGallaryResponse>> getAllProductGallaries() {
        List<ProductGallaryResponse> productGallaries = productGallaryService.getAll();
        return ResponseEntity.ok(productGallaries);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ProductGallaryResponse> getProductGallaryById(@PathVariable UUID id) {
        ProductGallaryResponse productGallary = productGallaryService.getById(id);
        if (productGallary != null) {
            return ResponseEntity.ok(productGallary);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-product-id/{productId}")
    public ResponseEntity<List<ProductGallaryResponse>> getProductGallariesByProductId(@PathVariable UUID productId) {
        List<ProductGallaryResponse> productGallaries = productGallaryService.findByProductId(productId);
        return ResponseEntity.ok(productGallaries);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductGallaryResponse> updateProductGallary(@RequestBody ProductGallaryRequest productGallaryRequest, @PathVariable UUID id) {
        ProductGallaryResponse updatedProductGallary = productGallaryService.update(id, productGallaryRequest);
        if (updatedProductGallary != null) {
            return ResponseEntity.ok(updatedProductGallary);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductGallaryResponse> deleteProductGallary(@PathVariable UUID id) {
        ProductGallaryResponse deletedProductGallary = productGallaryService.delete(id);
        if (deletedProductGallary != null) {
            return ResponseEntity.ok(deletedProductGallary);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete-by-product-id/{productId}")
    public ResponseEntity<Void> deleteProductGallariesByProductId(@PathVariable UUID productId) {
        productGallaryService.deleteByProductId(productId);
        return ResponseEntity.noContent().build();
    }
}
