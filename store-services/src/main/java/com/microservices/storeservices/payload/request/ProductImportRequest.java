package com.microservices.storeservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductImportRequest {

    private UUID storeId;

    private Double quantity;

    private Double price;

    private String description;

    private UUID createdBy;

    private UUID updatedBy;
}
