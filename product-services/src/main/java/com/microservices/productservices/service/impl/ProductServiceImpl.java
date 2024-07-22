package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.Product;
import com.microservices.productservices.entity.ProductCategory;
import com.microservices.productservices.entity.ProductTag;
import com.microservices.productservices.payload.request.ProductRequest;
import com.microservices.productservices.payload.response.ProductResponse;
import com.microservices.productservices.repository.ProductCategoryRepository;
import com.microservices.productservices.repository.ProductGallaryRepository;
import com.microservices.productservices.repository.ProductRepository;
import com.microservices.productservices.repository.ProductTagRepository;
import com.microservices.productservices.service.ProductService;
import com.microservices.productservices.service.ProductFeedbackService;

import jakarta.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductTagRepository productTagRepository;
    private final ProductGallaryRepository productGallaryRepository;
    private final ProductFeedbackService productFeedbackService;

    public ProductServiceImpl(ProductRepository productRepository,
            ProductCategoryRepository productCategoryRepository,
            ProductTagRepository productTagRepository,
            ProductGallaryRepository productGallaryRepository,
            ProductFeedbackService productFeedbackService) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.productTagRepository = productTagRepository;
        this.productGallaryRepository = productGallaryRepository;
        this.productFeedbackService = productFeedbackService;
    }

    @Override
    public ProductResponse create(ProductRequest productRequest) {
        // Create and save the Product entity
        Product product = new Product();
        mapRequestToEntity(productRequest, product);
        product.setCreatedAt(LocalDateTime.now());
        Product savedProduct = productRepository.save(product);

        // Create and save the ProductCategory entities for each category ID in the
        // request
        List<ProductCategory> productCategories = new ArrayList<>();
        for (UUID categoryId : productRequest.getCategoryIds()) {
            ProductCategory productCategory = new ProductCategory();
            productCategory.setProductId(savedProduct.getId());
            productCategory.setCategoryId(categoryId);
            productCategories.add(productCategory);
        }
        productCategoryRepository.saveAll(productCategories);

        // Create and save the ProductTag entities for each tag ID in the request
        List<ProductTag> productTags = new ArrayList<>();
        for (UUID tagId : productRequest.getTagIds()) {
            ProductTag productTag = new ProductTag();
            productTag.setProductId(savedProduct.getId());
            productTag.setTagId(tagId);
            productTags.add(productTag);
        }
        productTagRepository.saveAll(productTags);

        return mapProductToResponse(savedProduct);
    }

    @Override
    public void setImage(UUID id, String image) {
        Product product = productRepository.findById(id).orElse(null);
        product.setImage(image);
        productRepository.save(product);
    }

    @Override
    public void switchStatus(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = product.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        product.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        productRepository.save(product);
    }

    @Override
    public void trash(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Đặt trạng thái thành 2
        product.setStatus(2);

        // Lưu trạng thái đã thay đổi
        productRepository.save(product);
    }

    @Override
    public void isDisplay(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = product.getStatus();
        int newStatus = (currentStatus == 3) ? 1 : 3;
        product.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        productRepository.save(product);
    }

    @Override
    public ProductResponse getById(UUID id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            return mapProductToResponse(product);
        }
        return null;
    }

    @Override
    public List<ProductResponse> getAll() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(this::mapProductToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse update(UUID id, ProductRequest productRequest) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct != null) {
            mapRequestToEntity(productRequest, existingProduct);
            existingProduct.setUpdatedAt(LocalDateTime.now());
            Product updatedProduct = productRepository.save(existingProduct);

            List<ProductCategory> productCategories = new ArrayList<>();
            for (UUID categoryId : productRequest.getCategoryIds()) {
                ProductCategory productCategory = new ProductCategory();
                productCategory.setProductId(existingProduct.getId());
                productCategory.setCategoryId(categoryId);
                productCategories.add(productCategory);
            }
            productCategoryRepository.saveAll(productCategories);

            // Create and save the ProductTag entities for each tag ID in the request
            List<ProductTag> productTags = new ArrayList<>();
            for (UUID tagId : productRequest.getTagIds()) {
                ProductTag productTag = new ProductTag();
                productTag.setProductId(existingProduct.getId());
                productTag.setTagId(tagId);
                productTags.add(productTag);
            }
            productTagRepository.saveAll(productTags);

            return mapProductToResponse(updatedProduct);

        }

        return null;
    }

    @Override
    @Transactional
    public ProductResponse delete(UUID id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            // Delete product categories associated with the product
            productCategoryRepository.deleteByProductId(id);

            // Delete product tags associated with the product
            productTagRepository.deleteByProductId(id);

            productGallaryRepository.deleteByProductId(id);

            // Delete the product itself
            productRepository.delete(product);

            return mapProductToResponse(product);
        }
        return null;
    }

    @Override
    public List<ProductResponse> findByBrandId(UUID brandId) {
        List<Product> products = productRepository.findByBrandId(brandId);
        return products.stream()
                .map(this::mapProductToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> searchByName(String name) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
        return products.stream()
                .map(this::mapProductToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateProductEvaluate(UUID productId) {
        Integer averageEvaluate = productFeedbackService.getAverageEvaluateByProductId(productId);
        if (averageEvaluate != null) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("NOT_FOUND"));
            product.setEvaluate(averageEvaluate);
            productRepository.save(product);
        }
    }

    @Override
    public Page<ProductResponse> findByUser(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> productPage = productRepository.findByCreatedBy(userId, pageable);
        return productPage.map(this::mapProductToResponse);
    }

    @Override
    public Page<ProductResponse> getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> productPage = productRepository.findByStatusNot(2, pageable);
        return productPage.map(this::mapProductToResponse);
    }

    @Override
    public List<ProductResponse> findAllByUser(UUID userId) {
        List<Product> products = productRepository.findByCreatedBy(userId);
        return products.stream()
                .map(this::mapProductToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapProductToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .brandId(product.getBrandId())
                .name(product.getName())
                .image(product.getImage())
                .price(product.getPrice())
                .detail(product.getDetail())
                .description(product.getDescription())
                .evaluate(product.getEvaluate())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .createdBy(product.getCreatedBy())
                .updatedBy(product.getUpdatedBy())
                .status(product.getStatus())
                .build();
    }

    private void mapRequestToEntity(ProductRequest productRequest, Product product) {
        BeanUtils.copyProperties(productRequest, product);
    }
}
