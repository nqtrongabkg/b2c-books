package com.microservices.productservices.controller;

import com.microservices.productservices.payload.request.CategoryRequest;
import com.microservices.productservices.payload.request.SetImageRequest;
import com.microservices.productservices.payload.response.CategoryResponse;
import com.microservices.productservices.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("product-services/api/categories")
@CrossOrigin(origins = { "http://localhost:3000" })
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryRequest categoryRequest) {
        CategoryResponse createdCategory = categoryService.create(categoryRequest);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/set-image")
    public ResponseEntity<String> setImage(@RequestBody SetImageRequest setImageRequest) {
        categoryService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok("Set image done");
    }

    @PutMapping("/add-product-qty/{id}")
    public ResponseEntity<Void> addProductQty(@PathVariable UUID id) {
        try {
            categoryService.addProductQty(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        categoryService.switchStatus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        categoryService.trash(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/display/{id}")
    public ResponseEntity<Void> display(@PathVariable UUID id) {
        categoryService.isDisplay(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable UUID id) {
        CategoryResponse category = categoryService.getById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAll();
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@RequestBody CategoryRequest categoryRequest,
            @PathVariable UUID id) {
        CategoryResponse updatedCategory = categoryService.update(id, categoryRequest);
        if (updatedCategory != null) {
            return ResponseEntity.ok(updatedCategory);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CategoryResponse> deleteCategory(@PathVariable UUID id) {
        CategoryResponse deletedCategory = categoryService.delete(id);
        if (deletedCategory != null) {
            return ResponseEntity.ok(deletedCategory);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<CategoryResponse>> searchProductsByName(@PathVariable String name) {
        List<CategoryResponse> categories = categoryService.searchByName(name);
        return ResponseEntity.ok(categories);
    }

}
