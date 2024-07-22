package com.microservices.storeservices.controller;

import com.microservices.storeservices.payload.request.ProductExportRequest;
import com.microservices.storeservices.payload.response.ProductExportResponse;
import com.microservices.storeservices.service.ProductExportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("store-services/api/product-exports")
public class ProductExportController {

    private final ProductExportService productExportService;

    public ProductExportController(ProductExportService productExportService) {
        this.productExportService = productExportService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductExportResponse> createProductExport(@RequestBody ProductExportRequest productExportRequest) {
        ProductExportResponse createdProductExport = productExportService.create(productExportRequest);
        return new ResponseEntity<>(createdProductExport, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ProductExportResponse> getProductExportById(@PathVariable UUID id) {
        ProductExportResponse productExport = productExportService.getById(id);
        if (productExport != null) {
            return ResponseEntity.ok(productExport);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ProductExportResponse>> getAllProductExports() {
        List<ProductExportResponse> productExports = productExportService.getAll();
        return ResponseEntity.ok(productExports);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductExportResponse> updateProductExport(@RequestBody ProductExportRequest productExportRequest, @PathVariable UUID id) {
        ProductExportResponse updatedProductExport = productExportService.update(id, productExportRequest);
        if (updatedProductExport != null) {
            return ResponseEntity.ok(updatedProductExport);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductExportResponse> deleteProductExport(@PathVariable UUID id) {
        ProductExportResponse deletedProductExport = productExportService.delete(id);
        if (deletedProductExport != null) {
            return ResponseEntity.ok(deletedProductExport);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-product/{productId}")
    public ResponseEntity<List<ProductExportResponse>> getProductExportsByProductId(@PathVariable UUID productId) {
        List<ProductExportResponse> productExports = productExportService.getByProductId(productId);
        return ResponseEntity.ok(productExports);
    }

    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<ProductExportResponse>> getProductExportsByUser(@PathVariable UUID userId) {
        List<ProductExportResponse> productExports = productExportService.getByUser(userId);
        return ResponseEntity.ok(productExports);
    }
}
