package com.microservices.storeservices.controller;

import com.microservices.storeservices.payload.request.ProductStoreRequest;
import com.microservices.storeservices.payload.response.ProductStoreResponse;
import com.microservices.storeservices.service.ProductStoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("store-services/api/product-stores")
public class ProductStoreController {

    private final ProductStoreService productStoreService;

    public ProductStoreController(ProductStoreService productStoreService) {
        this.productStoreService = productStoreService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductStoreResponse> createProductStore(@RequestBody ProductStoreRequest productStoreRequest) {
        ProductStoreResponse createdProductStore = productStoreService.create(productStoreRequest);
        return new ResponseEntity<>(createdProductStore, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ProductStoreResponse> getProductStoreById(@PathVariable UUID id) {
        ProductStoreResponse productStore = productStoreService.getById(id);
        if (productStore != null) {
            return ResponseEntity.ok(productStore);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ProductStoreResponse>> getAllProductStores() {
        List<ProductStoreResponse> productStores = productStoreService.getAll();
        return ResponseEntity.ok(productStores);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductStoreResponse> updateProductStore(@RequestBody ProductStoreRequest productStoreRequest, @PathVariable UUID id) {
        ProductStoreResponse updatedProductStore = productStoreService.update(id, productStoreRequest);
        if (updatedProductStore != null) {
            return ResponseEntity.ok(updatedProductStore);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductStoreResponse> deleteProductStore(@PathVariable UUID id) {
        ProductStoreResponse deletedProductStore = productStoreService.delete(id);
        if (deletedProductStore != null) {
            return ResponseEntity.ok(deletedProductStore);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete-by-option-value/{id}")
    public ResponseEntity<Void> deleteProductStoresByOptionValueId(@PathVariable UUID id) {
        productStoreService.deleteByOptionValueId(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-by-product/{productId}") 
    public ResponseEntity<Void> deleteProductStoresByProductId(@PathVariable UUID productId) {
        productStoreService.deleteByProductId(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-by-product/{productId}")
    public ResponseEntity<List<ProductStoreResponse>> getProductStoresByProductId(@PathVariable UUID productId) {
        List<ProductStoreResponse> productStores = productStoreService.getByProductId(productId);
        return ResponseEntity.ok(productStores);
    }

    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<ProductStoreResponse>> getProductStoresByUser(@PathVariable UUID userId) {
        List<ProductStoreResponse> productStores = productStoreService.getByCreatedBy(userId);
        return ResponseEntity.ok(productStores);    
    }

    @GetMapping("/get-by-option-value/{optionValueId}")
    public ResponseEntity<ProductStoreResponse> getProductStoreByOptionValueId(@PathVariable UUID optionValueId) {
        ProductStoreResponse productStore = productStoreService.getByOptionValueId(optionValueId);
        if (productStore != null) {
            return ResponseEntity.ok(productStore);
        }
        return ResponseEntity.notFound().build();
    }
}
