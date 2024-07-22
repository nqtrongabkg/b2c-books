package com.microservices.productservices.payload.request;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductSaleRequest {

    private UUID productId;

    private Integer quantity;

    private Double priceSale;

    private String description;

    private LocalDateTime dateBegin;

    private LocalDateTime dateEnd;

    private UUID createdBy;

    private UUID updatedBy;

    private Integer status;
}
