//package com.eazybytes.gatewayserver.config;
//
//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    private final InvestmentWebSocketHandler webSocketHandler;
//
//    public WebSocketConfig(InvestmentWebSocketHandler webSocketHandler) {
//        this.webSocketHandler = webSocketHandler;
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(webSocketHandler, "/ws/investments").setAllowedOrigins("*");
//    }
//}
