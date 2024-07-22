package com.microservices.configservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Data;


@Data
public class InfomationsResponse {

    private UUID id;

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID updatedBy;

    private int status;
}
