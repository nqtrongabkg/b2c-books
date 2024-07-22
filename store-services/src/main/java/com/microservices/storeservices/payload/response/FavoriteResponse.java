package com.microservices.storeservices.payload.response;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FavoriteResponse {

    private UUID id;

    private UUID productId;

    private UUID userId;
}
