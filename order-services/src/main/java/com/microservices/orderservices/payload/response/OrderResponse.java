package com.microservices.orderservices.payload.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderResponse {

    private UUID id;
    
    private UUID userId;

    private Double totalPrice;

    private String payment;

    private String deliveryAddress;

    private String deliveryPhone;

    private String deliveryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer status;
}
