package com.agriculturalmarket.investments.mapper;

import com.agriculturalmarket.investments.entity.payments.PaymentDto;
import payment.Payment;

public class PaymentsMapper {
    public static PaymentDto toDto(Payment.PaymentResponse payment, PaymentDto paymentDto) {
        paymentDto.setId(payment.getId());
        paymentDto.setPaymentId(payment.getPaymentId());
        paymentDto.setAmount(payment.getAmount());
        paymentDto.setCurrency(payment.getCurrency());
        paymentDto.setStatus(payment.getStatus());
        paymentDto.setDescription(payment.getDescription());
        return paymentDto;
    }
}
