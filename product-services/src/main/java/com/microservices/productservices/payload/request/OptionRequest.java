package com.microservices.productservices.payload.request;

import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OptionRequest {

    private UUID productId;

    private String name;

    private String description;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;

    private List<String> values;
}
