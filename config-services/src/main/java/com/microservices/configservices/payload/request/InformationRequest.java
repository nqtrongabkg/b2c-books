package com.microservices.configservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class InformationRequest {

    private String name;

    private String logo;

    private String address;

    private String email;

    private String phone;

    private String businessNumber;

    private String license;

    private String repersent;

    private String repersentPhone;

    private UUID createdBy;

    private UUID updatedBy;

    private int status;
}
