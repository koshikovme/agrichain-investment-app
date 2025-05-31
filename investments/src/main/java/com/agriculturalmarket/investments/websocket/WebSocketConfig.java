package com.agriculturalmarket.investments.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register endpoint without SockJS first
        registry.addEndpoint("/ws/investments")
                .setAllowedOriginPatterns("*")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:8072") // Add your frontend URLs
                .withSockJS()
                .setHeartbeatTime(25000); // Prevent timeouts

        // Also register without SockJS for native WebSocket connections
        registry.addEndpoint("/ws/investments")
                .setAllowedOriginPatterns("*")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:8072");
    }
}