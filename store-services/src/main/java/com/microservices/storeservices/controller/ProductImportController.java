package com.microservices.storeservices.controller;

import com.microservices.storeservices.payload.request.ProductImportRequest;
import com.microservices.storeservices.payload.response.ProductImportResponse;
import com.microservices.storeservices.service.ProductImportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("store-services/api/product-imports")
public class ProductImportController {

    private final ProductImportService productImportService;

    public ProductImportController(ProductImportService productImportService) {
        this.productImportService = productImportService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductImportResponse> createProductImport(@RequestBody ProductImportRequest productImportRequest) {
        ProductImportResponse createdProductImport = productImportService.create(productImportRequest);
        return new ResponseEntity<>(createdProductImport, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ProductImportResponse> getProductImportById(@PathVariable UUID id) {
        ProductImportResponse productImport = productImportService.getById(id);
        if (productImport != null) {
            return ResponseEntity.ok(productImport);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ProductImportResponse>> getAllProductImports() {
        List<ProductImportResponse> productImports = productImportService.getAll();
        return ResponseEntity.ok(productImports);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductImportResponse> updateProductImport(@RequestBody ProductImportRequest productImportRequest, @PathVariable UUID id) {
        ProductImportResponse updatedProductImport = productImportService.update(id, productImportRequest);
        if (updatedProductImport != null) {
            return ResponseEntity.ok(updatedProductImport);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductImportResponse> deleteProductImport(@PathVariable UUID id) {
        ProductImportResponse deletedProductImport = productImportService.delete(id);
        if (deletedProductImport != null) {
            return ResponseEntity.ok(deletedProductImport);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<ProductImportResponse>> getProductImportsByUser(@PathVariable UUID userId) {
        List<ProductImportResponse> productImports = productImportService.getByUser(userId);
        return ResponseEntity.ok(productImports);
    }
}
