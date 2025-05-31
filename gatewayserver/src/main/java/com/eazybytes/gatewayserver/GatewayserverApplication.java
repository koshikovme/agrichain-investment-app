package com.eazybytes.gatewayserver;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.circuitbreaker.resilience4j.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import java.time.Duration;
import java.time.LocalDateTime;

@SpringBootApplication
public class GatewayserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayserverApplication.class, args);
	}

//	@Bean
//	public RouteLocator agriChainRouteConfig(RouteLocatorBuilder builder) {
//		return builder.routes()
//				.route(
//					p  -> p
//						.path("/agrichain/users/**")
//						.filters(f -> f
//								.preserveHostHeader()
//								.rewritePath("/agrichain/users/(?<segment>.*)", "/api/${segment}")
//								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
////								.circuitBreaker(config ->
////										config.setName("accountsCircuitBreaker")
////										.setFallbackUri("forward:/contactSupport")
////								)
//						)
//						.uri("lb://USERS")
//				)
//				.route(
//						p  -> p
//								.path("/agrichain/investments/**")
//								.filters(f -> f
//										.rewritePath("/agrichain/investments/(?<segment>.*)", "/api/${segment}")
//										.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
////										.requestRateLimiter(config -> config
////												.setRateLimiter(redisRateLimiter())
////												.setKeyResolver(userKeyResolver()))
//								)
//								.uri("lb://INVESTMENTS")
//				)
//				.build();
//	}

	@Bean
	public RouteLocator agriChainRouteConfig(RouteLocatorBuilder builder) {
		return builder.routes()
				.route(p -> p.path("/agrichain/users/**")
						.filters(f -> f
								.preserveHostHeader()
								.rewritePath("/agrichain/users/(?<segment>.*)", "/api/${segment}")
								.filter((exchange, chain) -> {
									String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
									if (authHeader != null) {
										exchange = exchange.mutate().request(
												r -> r.headers(headers -> headers.set("Authorization", authHeader))
										).build();
									}
									return chain.filter(exchange);
								})
						)
						.uri("lb://USERS")
				)
				// Аналогично для других маршрутов
				.route(p -> p.path("/agrichain/investments/**")
						.filters(f -> f
								.rewritePath("/agrichain/investments/(?<segment>.*)", "/api/${segment}")
								.filter((exchange, chain) -> {
									String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
									if (authHeader != null) {
										exchange = exchange.mutate().request(
												r -> r.headers(headers -> headers.set("Authorization", authHeader))
										).build();
									}
									return chain.filter(exchange);
								})
						)
						.uri("lb://INVESTMENTS")
				)
				.route(p -> p.path("/ws/users/**")
						.and()
						.header("Upgrade", "websocket")
						.uri("lb:ws://USERS")
				)
				.route(p -> p.path("/ws/investments/**")
						.and()
						.header("Upgrade", "websocket")
						.uri("lb:ws://INVESTMENTS")
				)
				.build();
	}


	@Bean
	public Customizer<ReactiveResilience4JCircuitBreakerFactory> defaultCustomizer() {
		return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
				.circuitBreakerConfig(CircuitBreakerConfig.ofDefaults())
				.timeLimiterConfig(TimeLimiterConfig.custom().timeoutDuration(Duration.ofSeconds(4)).build()).build());
	}

}
