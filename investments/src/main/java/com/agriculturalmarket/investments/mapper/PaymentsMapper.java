package com.agriculturalmarket.investments.mapper;

import com.agriculturalmarket.investments.dto.PaymentResponseDto;
import payment.Payment;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class PaymentsMapper {
    public static PaymentResponseDto toDto(Payment.PaymentResponse payment) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setId(payment.getId());
        dto.setPaymentId(payment.getPaymentId());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setStatus(payment.getStatus());
        dto.setDescription(payment.getDescription());

        dto.setPaypalUrl(payment.getPaypalUrl());
        dto.setPayerEmail(payment.getPayerEmail());
        dto.setPayerId(payment.getPayerId());
        dto.setMerchantId(payment.getMerchantId());

        dto.setSolanaSignature(payment.getSolanaSignature());
        dto.setSolanaAddress(payment.getSolanaAddress());
        dto.setStoredInSolana(payment.getStoredInSolana());
        dto.setSolanaTransactionUrl(payment.getSolanaTransactionUrl());

        if (payment.hasCreatedAt()) {
            dto.setCreatedAt(Instant.ofEpochSecond(payment.getCreatedAt().getSeconds(), payment.getCreatedAt().getNanos()));
        }
        if (payment.hasUpdatedAt()) {
            dto.setUpdatedAt(Instant.ofEpochSecond(payment.getUpdatedAt().getSeconds(), payment.getUpdatedAt().getNanos()));
        }
        if (payment.hasCompletedAt()) {
            dto.setCompletedAt(Instant.ofEpochSecond(payment.getCompletedAt().getSeconds(), payment.getCompletedAt().getNanos()));
        }

        // Преобразование metadata (Map<String, String>)
        if (payment.getMetadataCount() > 0) {
            Map<String, String> metadata = new HashMap<>(payment.getMetadataMap());
            dto.setMetadata(metadata);
        }

        dto.setErrorCode(payment.getErrorCode());
        dto.setErrorMessage(payment.getErrorMessage());

        return dto;
    }
}
