package com.microservices.configservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class SliderResponse {

    private UUID id;

    private String name;

    private String image;

    private String description;

    private UUID createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID updatedBy;

    private int status;
}
