package com.eazybytes.gatewayserver.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Order(1)
@Component
public class RequestTraceFilter implements GlobalFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestTraceFilter.class);

    private final FilterUtility filterUtility;

    public RequestTraceFilter(FilterUtility filterUtility) {
        this.filterUtility = filterUtility;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpHeaders requestHeaders = exchange.getRequest().getHeaders();

        if (filterUtility.hasCorrelationId(requestHeaders)) {
            String correlationId = filterUtility.getCorrelationId(requestHeaders).orElseThrow();
            logger.debug("agrichain-correlation-id found in RequestTraceFilter : {}", correlationId);
            return chain.filter(exchange);
        }

        String correlationId = generateCorrelationId();
        ServerWebExchange exchangeWithCorrelationId = filterUtility.setCorrelationId(exchange, correlationId);
        logger.debug("agrichain-correlation-id generated in RequestTraceFilter : {}", correlationId);
        return chain.filter(exchangeWithCorrelationId);
    }

    private String generateCorrelationId() {
        return java.util.UUID.randomUUID().toString();
    }

}
