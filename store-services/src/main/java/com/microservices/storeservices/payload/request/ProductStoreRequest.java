package com.microservices.storeservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductStoreRequest {

    private UUID productId;

    private UUID optionValueId;

    private Integer quantity;

    private Integer soldQuantity;

    private Double price;

    private UUID createdBy;

    private UUID updatedBy;
}

