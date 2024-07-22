package com.microservices.productservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class BrandRequest {

    private String name;

    private String description;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;

    private String image;
}
