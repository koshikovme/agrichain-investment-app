package com.eazybytes.gatewayserver.filters;

import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class RequestTraceFilterTest {

    private final RequestTraceFilter requestTraceFilter = new RequestTraceFilter(new FilterUtility());

    @Test
    void keepsExistingCorrelationIdFromRequest() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/test")
                        .header(FilterUtility.CORRELATION_ID, "corr-existing")
                        .build()
        );
        AtomicReference<String> correlationIdSeenByChain = new AtomicReference<>();

        Mono<Void> result = requestTraceFilter.filter(exchange, filteredExchange -> {
            correlationIdSeenByChain.set(
                    filteredExchange.getRequest().getHeaders().getFirst(FilterUtility.CORRELATION_ID)
            );
            return Mono.empty();
        });

        StepVerifier.create(result).verifyComplete();

        assertThat(correlationIdSeenByChain.get()).isEqualTo("corr-existing");
    }

    @Test
    void generatesCorrelationIdWhenRequestDoesNotContainIt() {
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/test").build());
        AtomicReference<String> correlationIdSeenByChain = new AtomicReference<>();

        Mono<Void> result = requestTraceFilter.filter(exchange, filteredExchange -> {
            correlationIdSeenByChain.set(
                    filteredExchange.getRequest().getHeaders().getFirst(FilterUtility.CORRELATION_ID)
            );
            return Mono.empty();
        });

        StepVerifier.create(result).verifyComplete();

        assertThat(correlationIdSeenByChain.get()).isNotBlank();
    }
}
