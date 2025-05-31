package com.agriculturalmarket.investments.websocket;

import com.agriculturalmarket.investments.dto.InvestmentsDto;
import com.agriculturalmarket.investments.service.InvestmentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class InvestmentsWebSocketSender {

    private final SimpMessagingTemplate messagingTemplate;
    private final InvestmentsService investmentsService;

    // Периодически отправлять все инвестиции всем подписчикам
    @Scheduled(fixedRate = 5000) // каждые 5 секунд
    public void sendAllInvestments() {
        List<InvestmentsDto> allInvestments = investmentsService.fetchAllInvestments("temp_bootleneck_correlation_id");
        messagingTemplate.convertAndSend("/topic/investments", allInvestments);
    }
}