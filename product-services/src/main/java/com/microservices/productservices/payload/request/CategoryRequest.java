package com.microservices.productservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CategoryRequest {

    private String name;

    private Long productQuantity;

    private String description;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;

}
