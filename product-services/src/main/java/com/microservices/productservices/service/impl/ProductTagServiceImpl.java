package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.ProductTag;
import com.microservices.productservices.payload.request.ProductTagRequest;
import com.microservices.productservices.payload.response.ProductTagResponse;
import com.microservices.productservices.repository.ProductTagRepository;
import com.microservices.productservices.service.ProductTagService;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductTagServiceImpl implements ProductTagService {

    private final ProductTagRepository productTagRepository;

    public ProductTagServiceImpl(ProductTagRepository productTagRepository) {
        this.productTagRepository = productTagRepository;
    }

    @Override
    public ProductTagResponse create(ProductTagRequest productTagRequest) {
        ProductTag productTag = new ProductTag();
        productTag.setProductId(productTagRequest.getProductId());
        productTag.setTagId(productTagRequest.getTagId());
        ProductTag savedProductTag = productTagRepository.save(productTag);
        return mapProductTagToResponse(savedProductTag);
    }

    @Override
    public List<ProductTagResponse> getProductTagsByProductId(UUID productId) {
        List<ProductTag> productTags = productTagRepository.findByProductId(productId);
        return mapProductTagsToResponse(productTags);
    }

    @Override
    public List<ProductTagResponse> getProductTagsByTagId(UUID tagId) {
        List<ProductTag> productTags = productTagRepository.findByTagId(tagId);
        return mapProductTagsToResponse(productTags);
    }

    @Override
    public void deleteByProductIdAndTagId(UUID productId, UUID tagId) {
        productTagRepository.deleteByProductIdAndTagId(productId, tagId);
    }

    @Transactional
    @Override
    public void deleteProductTagsByProductId(UUID productId) {
        productTagRepository.deleteByProductId(productId);
    }


    @Override
    public void deleteProductTagsByTagId(UUID tagId) {
        productTagRepository.deleteByTagId(tagId);
    }

    @Override
    public List<ProductTagResponse> getAllProductTags() {
        List<ProductTag> productTags = productTagRepository.findAll();
        return mapProductTagsToResponse(productTags);
    }

    @Override
    public ProductTagResponse delete(UUID id) {
        ProductTag productTag = productTagRepository.findById(id).orElse(null);
        if (productTag != null) {
            productTagRepository.delete(productTag);
            return mapProductTagToResponse(productTag);
        }
        return null;
    }

    // Helper method to map ProductTag to ProductTagResponse
    private ProductTagResponse mapProductTagToResponse(ProductTag productTag) {
        return ProductTagResponse.builder()
                .id(productTag.getId())
                .productId(productTag.getProductId())
                .tagId(productTag.getTagId())
                .build();
    }

    // Helper method to map list of ProductTag to list of ProductTagResponse
    private List<ProductTagResponse> mapProductTagsToResponse(List<ProductTag> productTags) {
        return productTags.stream()
                .map(this::mapProductTagToResponse)
                .collect(Collectors.toList());
    }
}
