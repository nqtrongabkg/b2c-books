package com.microservices.configservices.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.GenericGenerator;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Slider {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private UUID id;

    private String name;

    private String image;

    private String description;

    private UUID createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private UUID updatedBy;

    private int status;
}
