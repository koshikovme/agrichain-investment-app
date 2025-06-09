package com.agriculturalmarket.users.websocket;

import com.agriculturalmarket.users.dto.UserDetailsDto;
import com.agriculturalmarket.users.service.IAccountsService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UsersWebSocketSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final IAccountsService accountsService;

    @Scheduled(fixedRate = 5000)
    public void sendAllUsers() {
        List<UserDetailsDto> users = accountsService.fetchAllUserDetails("bottleneck_correlation_id");
        messagingTemplate.convertAndSend("/topic/users", users);
    }
}