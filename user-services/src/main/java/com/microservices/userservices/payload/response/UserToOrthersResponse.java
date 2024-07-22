package com.microservices.userservices.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserToOrthersResponse {

    private String name;

    private String email;

    private String phone;

    private byte[] avarta;

    private String address;
}
