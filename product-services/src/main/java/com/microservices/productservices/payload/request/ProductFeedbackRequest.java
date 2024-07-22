package com.microservices.productservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductFeedbackRequest {

    private UUID orderItemId;

    private UUID productId;

    private Integer evaluate;

    private String image;

    private String description;

    private String detail;

    private UUID createdBy;

    private UUID updatedBy;
}
