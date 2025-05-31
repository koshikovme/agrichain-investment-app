//package com.agriculturalmarket.users.websocket;
//
//import com.agriculturalmarket.users.service.IAccountsService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.handler.annotation.Header;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//import java.util.Map;
//
//@Controller
//@RequiredArgsConstructor
//class UsersWebSocketController {
//
//    private final IAccountsService accountsService;
//    private final SimpMessagingTemplate messagingTemplate;
//
//    // Handle client requests with parameters
//    @MessageMapping("/investments.request")
//    public void handleInvestmentRequest(@Payload Map<String, String> request,
//                                        @Header("simpSessionId") String sessionId) {
//        String userId = request.get("userId");
//        String accountNumber = request.get("accountNumber");
//
//        List<InvestmentsDto> investments = accountsService.fetchAccountByAccountNumber(accountNumber);
//
//        // Send response back to the requesting client
//        messagingTemplate.convertAndSendToUser(sessionId, "/topic/investments", investments);
//    }
//
//    // Handle subscription with parameters
//    @SubscribeMapping("/investments/{userId}")
//    public List<InvestmentsDto> handleSubscription(@Header Map<String, Object> headers,
//                                                   @Header("userId") String userId) {
//        // Return initial data when client subscribes
//        return accountsService.fetchAccountByUserId(userId);
//    }
//}