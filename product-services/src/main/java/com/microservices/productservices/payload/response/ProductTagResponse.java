package com.microservices.productservices.payload.response;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductTagResponse {

    private UUID id;

    private UUID productId;

    private UUID tagId;
}
