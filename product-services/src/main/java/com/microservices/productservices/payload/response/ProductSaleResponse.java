package com.microservices.productservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductSaleResponse {

    private UUID id;

    private UUID productId;

    private Integer quantity;

    private Double priceSale;

    private String description;

    private LocalDateTime dateBegin;

    private LocalDateTime dateEnd;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;
}
