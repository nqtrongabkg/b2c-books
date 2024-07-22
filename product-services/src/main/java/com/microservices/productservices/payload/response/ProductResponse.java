package com.microservices.productservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductResponse {

    private UUID id;

    private UUID brandId;

    private String name;

    private String image;

    private Double price;

    private String detail;

    private String description;

    private Integer evaluate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;
}
