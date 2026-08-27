package com.eazybytes.gatewayserver.filters;

import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import org.springframework.http.HttpHeaders;

import java.util.Optional;

@Component
public class FilterUtility {

    public static final String CORRELATION_ID = "agrichain-correlation-id";

    public Optional<String> getCorrelationId(HttpHeaders requestHeaders) {
        return Optional.ofNullable(requestHeaders.getFirst(CORRELATION_ID))
                .filter(correlationId -> !correlationId.isBlank());
    }

    public boolean hasCorrelationId(HttpHeaders requestHeaders) {
        return getCorrelationId(requestHeaders).isPresent();
    }

    public ServerWebExchange setRequestHeader(ServerWebExchange exchange, String name, String value) {
        return exchange.mutate().request(exchange.getRequest().mutate().header(name, value).build()).build();
    }

    public ServerWebExchange setCorrelationId(ServerWebExchange exchange, String correlationId) {
        return this.setRequestHeader(exchange, CORRELATION_ID, correlationId);
    }

}
