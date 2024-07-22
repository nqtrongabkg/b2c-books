package com.microservices.productservices.payload.response;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OptionValueResponse {

    private UUID id;

    private UUID optionId;

    private String value;
}
