package com.microservices.productservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductFeedbackResponse {

    private UUID id;

    private UUID orderItemId;

    private UUID productId;

    private Integer evaluate;

    private String image;

    private String description;

    private String detail;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;
}
