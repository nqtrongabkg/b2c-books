package com.microservices.productservices.payload.request;

import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductRequest {

    private UUID brandId;

    private String name;

    private String image;

    private Double price;

    private String detail;

    private String description;

    private Integer evaluate;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;

    private List<UUID> categoryIds;

    private List<UUID> tagIds;
}
