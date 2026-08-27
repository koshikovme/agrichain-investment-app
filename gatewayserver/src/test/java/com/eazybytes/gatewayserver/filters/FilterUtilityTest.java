package com.eazybytes.gatewayserver.filters;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;

import static org.assertj.core.api.Assertions.assertThat;

class FilterUtilityTest {

    private final FilterUtility filterUtility = new FilterUtility();

    @Test
    void getCorrelationIdReturnsFirstHeaderValueWhenPresent() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(FilterUtility.CORRELATION_ID, "corr-123");
        headers.add(FilterUtility.CORRELATION_ID, "corr-456");

        assertThat(filterUtility.getCorrelationId(headers)).contains("corr-123");
    }

    @Test
    void getCorrelationIdReturnsEmptyWhenHeaderIsMissingOrBlank() {
        HttpHeaders missingHeaders = new HttpHeaders();
        HttpHeaders blankHeaders = new HttpHeaders();
        blankHeaders.add(FilterUtility.CORRELATION_ID, " ");

        assertThat(filterUtility.getCorrelationId(missingHeaders)).isEmpty();
        assertThat(filterUtility.getCorrelationId(blankHeaders)).isEmpty();
    }

    @Test
    void setCorrelationIdAddsHeaderToRequest() {
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/").build());

        ServerWebExchange updatedExchange = filterUtility.setCorrelationId(exchange, "corr-789");

        assertThat(updatedExchange.getRequest().getHeaders().getFirst(FilterUtility.CORRELATION_ID))
                .isEqualTo("corr-789");
    }
}
