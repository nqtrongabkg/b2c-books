package com.microservices.configservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class BannerRequest {

    private String name;

    private String image;

    private String description;

    private UUID createdBy;

    private UUID updatedBy;

    private int status;
}
