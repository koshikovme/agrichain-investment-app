package com.agriculturalmarket.investments.service.grpcclient;

import grpc.Notification;
import grpc.NotificationServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Service;

@Service
public class NotificationGrpcClient {

    private final NotificationServiceGrpc.NotificationServiceBlockingStub stub;

    public NotificationGrpcClient() {
        ManagedChannel channel = ManagedChannelBuilder
                .forAddress("notification-service", 8081)
                .usePlaintext()
                .build();

        stub = NotificationServiceGrpc.newBlockingStub(channel);
    }

    public Notification.SendNotificationResponse sendLoginNotification(Notification.AuthNotificationRequest authNotificationRequest) {
        return stub.sendLoginNotification(authNotificationRequest);
    }

    public Notification.SendNotificationResponse sendRegistrationNotification(Notification.AuthNotificationRequest authNotificationRequest) {
        return stub.sendRegistrationNotification(authNotificationRequest);
    }

    public Notification.SendNotificationResponse sendUserNotification(Notification.UserNotificationRequest userNotificationRequest) {
        return stub.sendUserNotification(userNotificationRequest);
    }

}
