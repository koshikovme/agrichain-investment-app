package com.eazybytes.gatewayserver.filters;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;

class ResponseTraceFilterTest {

    private final GlobalFilter responseTraceFilter =
            new ResponseTraceFilter(new FilterUtility()).postGlobalFilter();

    @Test
    void copiesRequestCorrelationIdToResponseHeadersWhenMissing() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/test")
                        .header(FilterUtility.CORRELATION_ID, "corr-response")
                        .build()
        );

        StepVerifier.create(responseTraceFilter.filter(exchange, filteredExchange -> Mono.empty()))
                .verifyComplete();

        assertThat(exchange.getResponse().getHeaders().getFirst(FilterUtility.CORRELATION_ID))
                .isEqualTo("corr-response");
    }

    @Test
    void leavesExistingResponseCorrelationIdUntouched() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/test")
                        .header(FilterUtility.CORRELATION_ID, "corr-request")
                        .build()
        );
        exchange.getResponse().getHeaders().add(FilterUtility.CORRELATION_ID, "corr-response");

        StepVerifier.create(responseTraceFilter.filter(exchange, filteredExchange -> Mono.empty()))
                .verifyComplete();

        assertThat(exchange.getResponse().getHeaders().get(FilterUtility.CORRELATION_ID))
                .containsExactly("corr-response");
    }
}
