package com.agriculturalmarket.investments.dto;

import lombok.Data;
import java.time.Instant;
import java.util.Map;

@Data
public class PaymentResponseDto {
    private String id;
    private String paymentId;
    private Double amount;
    private String currency;
    private String status;
    private String description;

    // PayPal specific fields
    private String paypalUrl;
    private String payerEmail;
    private String payerId;
    private String merchantId;

    // Solana fields
    private String solanaSignature;
    private String solanaAddress;
    private Boolean storedInSolana;
    private String solanaTransactionUrl;

    // Timestamps
    private Instant createdAt;
    private Instant updatedAt;
    private Instant completedAt;

    // Additional data
    private Map<String, String> metadata;

    // Error information
    private String errorCode;
    private String errorMessage;
}