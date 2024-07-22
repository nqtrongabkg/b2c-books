package com.microservices.orderservices.service;

import com.microservices.orderservices.payload.request.OrderRequest;
import com.microservices.orderservices.payload.response.OrderResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderService {

    OrderResponse create(OrderRequest orderRequest);

    OrderResponse getById(UUID id);

    List<OrderResponse> getAll();

    OrderResponse update(UUID id, OrderRequest orderRequest);

    OrderResponse delete(UUID id);
    
    List<OrderResponse> getByUserId(UUID userId);

    Optional<OrderResponse> getCart(UUID userId);

    void payment(UUID id, String pay);
}
