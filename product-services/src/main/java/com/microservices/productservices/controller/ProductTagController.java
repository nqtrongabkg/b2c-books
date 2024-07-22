package com.microservices.productservices.controller;

import com.microservices.productservices.payload.request.ProductTagRequest;
import com.microservices.productservices.payload.response.ProductTagResponse;
import com.microservices.productservices.service.ProductTagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("product-services/api/product-tags")
@CrossOrigin(origins = { "http://localhost:3000" })
public class ProductTagController {

    private final ProductTagService productTagService;

    public ProductTagController(ProductTagService productTagService) {
        this.productTagService = productTagService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductTagResponse> createProductTag(@RequestBody ProductTagRequest productTagRequest) {
        ProductTagResponse createdProductTag = productTagService.create(productTagRequest);
        return new ResponseEntity<>(createdProductTag, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete-by-product-tag-id")
    public ResponseEntity<Void> deleteProductTag(@RequestParam("productId") UUID productId,
                                                  @RequestParam("tagId") UUID tagId) {
        productTagService.deleteByProductIdAndTagId(productId, tagId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ProductTagResponse>> getAllProductTags() {
        List<ProductTagResponse> productTags = productTagService.getAllProductTags();
        return ResponseEntity.ok(productTags);
    }

    @GetMapping("/get-by-product-id/{productId}")
    public ResponseEntity<List<ProductTagResponse>> getProductTagsByProductId(@PathVariable UUID productId) {
        List<ProductTagResponse> productTags = productTagService.getProductTagsByProductId(productId);
        return ResponseEntity.ok(productTags);
    }

    @GetMapping("/get-by-tag-id/{tagId}")
    public ResponseEntity<List<ProductTagResponse>> getProductTagsByTagId(@PathVariable UUID tagId) {
        List<ProductTagResponse> productTags = productTagService.getProductTagsByTagId(tagId);
        return ResponseEntity.ok(productTags);
    }

    @DeleteMapping("/delete-by-product-id/{productId}")
    public ResponseEntity<Void> deleteProductTagsByProductId(@PathVariable UUID productId) {
        productTagService.deleteProductTagsByProductId(productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-by-tag-id/{tagId}")
    public ResponseEntity<Void> deleteProductTagsByTagId(@PathVariable UUID tagId) {
        productTagService.deleteProductTagsByTagId(tagId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductTagResponse> deleteBrand(@PathVariable UUID id) {
        ProductTagResponse productTagResponse = productTagService.delete(id);
        if (productTagResponse != null) {
            return ResponseEntity.ok(productTagResponse);
        }
        return ResponseEntity.notFound().build();
    }
}
