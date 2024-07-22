package com.microservices.productservices.controller;

import com.microservices.productservices.payload.response.ProductCategoryResponse;
import com.microservices.productservices.service.ProductCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("product-services/api/product-categories")
@CrossOrigin(origins = { "http://localhost:3000" })
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductCategoryResponse> createProductCategory(@RequestParam("productId") UUID productId,
            @RequestParam("categoryId") UUID categoryId) {
        ProductCategoryResponse createdProductCategory = productCategoryService.createProductCategory(productId,
                categoryId);
        return new ResponseEntity<>(createdProductCategory, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete-by-product-id")
    public ResponseEntity<Void> deleteProductCategory(@RequestParam("productId") UUID productId,
            @RequestParam("categoryId") UUID categoryId) {
        productCategoryService.deleteProductCategory(productId, categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ProductCategoryResponse>> getAllProductCategories() {
        List<ProductCategoryResponse> productCategories = productCategoryService.getAllProductCategories();
        return ResponseEntity.ok(productCategories);
    }

    @GetMapping("/get-by-product-id/{productId}")
    public ResponseEntity<List<ProductCategoryResponse>> getProductCategoriesByProductId(@PathVariable UUID productId) {
        List<ProductCategoryResponse> productCategories = productCategoryService.getProductCategoriesByProductId(productId);
        return ResponseEntity.ok(productCategories);
    }

    @GetMapping("/get-by-category-id/{categoryId}")
    public ResponseEntity<List<ProductCategoryResponse>> getProductCategoriesByCategoryId(@PathVariable UUID categoryId) {
        List<ProductCategoryResponse> productCategories = productCategoryService.getProductCategoriesByCategoryId(categoryId);
        return ResponseEntity.ok(productCategories);
    }

    @DeleteMapping("/delete-by-product-id/{productId}")
    public ResponseEntity<Void> deleteProductCategoriesByProductId(@PathVariable UUID productId) {
        productCategoryService.deleteProductCategoriesByProductId(productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-by-category-id/{categoryId}")
    public ResponseEntity<Void> deleteProductCategoriesByCategoryId(@PathVariable UUID categoryId) {
        productCategoryService.deleteProductCategoriesByCategoryId(categoryId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductCategoryResponse> deleteBrand(@PathVariable UUID id) {
        ProductCategoryResponse productCategoryResponse = productCategoryService.delete(id);
        if (productCategoryResponse != null) {
            return ResponseEntity.ok(productCategoryResponse);
        }
        return ResponseEntity.notFound().build();
    }
}
