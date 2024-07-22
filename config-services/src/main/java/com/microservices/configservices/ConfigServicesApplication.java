package com.microservices.configservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ConfigServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigServicesApplication.class, args);
	}

}
