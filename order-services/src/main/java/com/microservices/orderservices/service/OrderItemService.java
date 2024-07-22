package com.microservices.orderservices.service;

import com.microservices.orderservices.payload.request.OrderItemRequest;
import com.microservices.orderservices.payload.response.OrderItemResponse;

import java.util.List;
import java.util.UUID;

public interface OrderItemService {

    OrderItemResponse create(OrderItemRequest orderItemRequest);

    OrderItemResponse getById(UUID id);

    List<OrderItemResponse> getByOrderId(UUID orderId);

    List<OrderItemResponse> getAll();

    OrderItemResponse update(UUID id, OrderItemRequest orderItemRequest);

    OrderItemResponse delete(UUID id);

    void switchStatus(UUID id);

    void trash(UUID id);

    void export(UUID id);

    void complete(UUID id);
}
