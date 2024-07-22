package com.microservices.productservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductCategoryRequest {

    private UUID productId;

    private UUID categoryId;
}
