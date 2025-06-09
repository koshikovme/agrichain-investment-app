package com.agriculturalmarket.users.websocket;

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
        // Регистрируем endpoint с SockJS
        registry.addEndpoint("/ws/users")
                .setAllowedOriginPatterns("*")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:8072")
                .withSockJS()
                .setHeartbeatTime(25000);

        // Также endpoint без SockJS для нативных WebSocket
        registry.addEndpoint("/ws/users")
                .setAllowedOriginPatterns("*")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:8072");
    }
}