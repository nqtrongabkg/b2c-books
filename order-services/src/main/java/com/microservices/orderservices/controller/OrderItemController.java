package com.microservices.orderservices.controller;

import com.microservices.orderservices.payload.request.OrderItemRequest;
import com.microservices.orderservices.payload.response.OrderItemResponse;
import com.microservices.orderservices.service.OrderItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("order-services/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrderItemResponse> createOrderItem(@RequestBody OrderItemRequest orderItemRequest) {
        OrderItemResponse createdOrderItem = orderItemService.create(orderItemRequest);
        return new ResponseEntity<>(createdOrderItem, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<OrderItemResponse> getOrderItemById(@PathVariable UUID id) {
        OrderItemResponse orderItem = orderItemService.getById(id);
        if (orderItem != null) {
            return ResponseEntity.ok(orderItem);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-order/{orderId}")
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrder(@PathVariable UUID orderId) {
        List<OrderItemResponse> orderItems = orderItemService.getByOrderId(orderId);
        return ResponseEntity.ok(orderItems);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<OrderItemResponse>> getAllOrderItems() {
        List<OrderItemResponse> orderItems = orderItemService.getAll();
        return ResponseEntity.ok(orderItems);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderItemResponse> updateOrderItem(@RequestBody OrderItemRequest orderItemRequest, @PathVariable UUID id) {
        OrderItemResponse updatedOrderItem = orderItemService.update(id, orderItemRequest);
        if (updatedOrderItem != null) {
            return ResponseEntity.ok(updatedOrderItem);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OrderItemResponse> deleteOrderItem(@PathVariable UUID id) {
        OrderItemResponse deletedOrderItem = orderItemService.delete(id);
        if (deletedOrderItem != null) {
            return ResponseEntity.ok(deletedOrderItem);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        orderItemService.switchStatus(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        orderItemService.trash(id);
        return ResponseEntity.ok().build();
    }  

    @PutMapping("/export/{id}")
    public ResponseEntity<Void> export(@PathVariable UUID id) {
        orderItemService.export(id);
        return ResponseEntity.ok().build();
    }  

    @PutMapping("/complete/{id}")
    public ResponseEntity<Void> complete(@PathVariable UUID id) {
        orderItemService.complete(id);
        return ResponseEntity.ok().build();
    }  
}
