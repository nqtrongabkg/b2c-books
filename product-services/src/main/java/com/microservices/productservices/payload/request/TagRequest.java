package com.microservices.productservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class TagRequest {

    private String name;

    private String description;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;
}
