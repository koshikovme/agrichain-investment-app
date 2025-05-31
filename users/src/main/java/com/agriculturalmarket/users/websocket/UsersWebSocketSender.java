// UsersWebSocketSender.java
package com.agriculturalmarket.users.websocket;

import com.agriculturalmarket.users.dto.UserDetailsDto;
import com.agriculturalmarket.users.service.IAccountsService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UsersWebSocketSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final IAccountsService accountsService;

    // Пример отправки данных по конкретному номеру
    public void sendUserByMobile(String mobileNumber) {
        UserDetailsDto user = accountsService.fetchUserDetails("bottleneck_correlation_id", mobileNumber);
        messagingTemplate.convertAndSend("/topic/users/" + mobileNumber, user);
    }

    // Можно оставить и общий broadcast, если нужно
    @Scheduled(fixedRate = 5000)
    public void sendAllUsers() {
        // ...
    }
}