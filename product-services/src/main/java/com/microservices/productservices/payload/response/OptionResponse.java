package com.microservices.productservices.payload.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.microservices.productservices.entity.OptionValue;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OptionResponse {

    private UUID id;

    private UUID productId;

    private String name;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;

    private List<OptionValue> values;
}
