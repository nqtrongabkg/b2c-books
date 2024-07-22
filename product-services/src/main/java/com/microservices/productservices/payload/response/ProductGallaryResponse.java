package com.microservices.productservices.payload.response;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProductGallaryResponse {

    private UUID id;

    private UUID productId;

    private String image;
}
