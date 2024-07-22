package com.microservices.gatewayservices.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.function.Predicate;
import java.util.regex.Pattern;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
        "/eureka",
        "/image-service/**",
        "/user-services/api/users/create",
        "/user-services/api/users/validate",
        "/user-services/api/users/token",
        "/user-services/api/**",

        "/config-services/api/banners/get-by-id/**",
        "/config-services/api/banners/get-all",
        "/config-services/api/banners/get-display",
        "/config-services/api/informations/get-by-id/**",
        "/config-services/api/informations/get-all",
        "/config-services/api/informations/get-display",
        "/config-services/api/sliders/get-by-id/**",
        "/config-services/api/sliders/get-all",

        "/product-services/api/brands/get-by-id/**",
        "/product-services/api/brands/get-all",
        "/product-services/api/brands/get-by-user/**",
        "/product-services/api/brands/search/**",

        "/product-services/api/categories/get-by-id/**",
        "/product-services/api/categories/get-all",

        "/product-services/api/options/get-by-id/**",
        "/product-services/api/options/get-all",
        "/product-services/api/options/get-by-user/**",
        "/product-services/api/options/get-by-product-id/**",

        "/product-services/api/option-values/get-by-id/**",
        "/product-services/api/option-values/get-all",
        "/product-services/api/option-values/get-by-option-id/**",

        "/product-services/api/product-categories/get-all",
        "/product-services/api/categories/search/**",
        "/product-services/api/product-categories/get-by-product-id/**",
        "/product-services/api/product-categories/get-by-category-id/**",

        "/product-services/api/products/get-by-id/**",
        "/product-services/api/products/get-all",
        "/product-services/api/products/get-by-brand/**",
        "/product-services/api/products/search/**",
        "/product-services/api/products/get-product-page",
        "/product-services/api/products/get-by-user/**",

        "/product-services/api/product-feedbacks/get-all",
        "/product-services/api/product-feedbacks/get-by-id/**",
        "/product-services/api/product-feedbacks/get-by-product-id/**",

        "/product-services/api/product-galleries/get-all",
        "/product-services/api/product-galleries/get-by-id/**",
        "/product-services/api/product-galleries/get-by-product-id/**",

        "/product-services/api/product-sales/get-by-id/**",
        "/product-services/api/product-sales/get-all",
        "/product-services/api/product-sales/get-by-user/**",
        "/product-services/api/product-sales/get-by-product-id/**",

        "/product-services/api/product-tags/get-all",
        "/product-services/api/product-tags/get-by-product-id/**",
        "/product-services/api/product-tags/get-by-tag-id/**",

        "/product-services/api/tags/get-by-id/**",
        "/product-services/api/tags/get-all",

        "/store-services/api/product-stores/get-by-id/**",
        "/store-services/api/product-stores/get-all",
        "/store-services/api/product-stores/get-by-product/**",
        "/store-services/api/product-stores/get-by-user/**",
        "/store-services/api/product-stores/get-by-option-value/**"
    );

    public Predicate<ServerHttpRequest> isSecured =
        request -> openApiEndpoints.stream()
            .map(uri -> uri.replace("**", ".+"))  // Convert wildcards to regex
            .noneMatch(pattern -> Pattern.matches(pattern, request.getURI().getPath()));
}
