package com.microservices.orderservices.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
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
