package com.microservices.storeservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductExportResponse {

    private UUID id;

    private UUID orderItemId;

    private UUID productId;

    private Integer quantity;

    private Double price;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;
}
