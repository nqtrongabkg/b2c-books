package com.microservices.orderservices.controller;

import com.microservices.orderservices.payload.request.OrderRequest;
import com.microservices.orderservices.payload.response.OrderResponse;
import com.microservices.orderservices.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("order-services/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse createdOrder = orderService.create(orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID id) {
        OrderResponse order = orderService.getById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAll();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderResponse> updateOrder(@RequestBody OrderRequest orderRequest, @PathVariable UUID id) {
        OrderResponse updatedOrder = orderService.update(id, orderRequest);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OrderResponse> deleteOrder(@PathVariable UUID id) {
        OrderResponse deletedOrder = orderService.delete(id);
        if (deletedOrder != null) {
            return ResponseEntity.ok(deletedOrder);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/get-by-user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable UUID userId) {
        List<OrderResponse> orders = orderService.getByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/get-cart/{userId}")
    public ResponseEntity<OrderResponse> getCart(@PathVariable UUID userId) {
        Optional<OrderResponse> orderResponse = orderService.getCart(userId);
        if (orderResponse.isPresent()) {
            return ResponseEntity.ok(orderResponse.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/set-payment/{id}")
    public ResponseEntity<Void> updatePayment(@PathVariable UUID id, @RequestParam String pay) {
        orderService.payment(id, pay);
        return ResponseEntity.ok().build();
    }
}
