package com.microservices.orderservices.payload.request;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrderRequest {

    private UUID userId;

    private Double totalPrice;

    private String deliveryAddress;

    private String deliveryPhone;

    private String deliveryName;

    private Integer status;
}
