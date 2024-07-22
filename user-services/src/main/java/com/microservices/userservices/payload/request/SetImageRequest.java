package com.microservices.userservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SetImageRequest {
    private UUID id;
    private String image;
}
