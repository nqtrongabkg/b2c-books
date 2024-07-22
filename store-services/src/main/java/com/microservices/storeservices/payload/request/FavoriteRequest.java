package com.microservices.storeservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FavoriteRequest {

    private UUID productId;

    private UUID userId;
}
