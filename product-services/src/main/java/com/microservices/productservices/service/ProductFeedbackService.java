package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.ProductFeedbackRequest;
import com.microservices.productservices.payload.response.ProductFeedbackResponse;

import java.util.List;
import java.util.UUID;

public interface ProductFeedbackService {

    ProductFeedbackResponse create(ProductFeedbackRequest productFeedbackRequest);

    void setImage(UUID id, String image);

    ProductFeedbackResponse getById(UUID id);

    List<ProductFeedbackResponse> getAll();

    ProductFeedbackResponse update(UUID id, ProductFeedbackRequest productFeedbackRequest);

    ProductFeedbackResponse delete(UUID id);

    List<ProductFeedbackResponse> findByProductId(UUID productId);

    Integer getAverageEvaluateByProductId(UUID productId);
}
