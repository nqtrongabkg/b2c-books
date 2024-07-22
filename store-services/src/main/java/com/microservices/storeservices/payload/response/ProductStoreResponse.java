package com.microservices.storeservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductStoreResponse {

    private UUID id;

    private UUID productId;

    private UUID optionValueId;

    private Integer quantity;

    private Integer soldQuantity;

    private Double price;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;
}
