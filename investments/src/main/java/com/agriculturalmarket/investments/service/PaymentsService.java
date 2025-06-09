package com.agriculturalmarket.investments.service;

import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.PaymentResponseDto;

import java.util.List;

public interface PaymentsService {
    PaymentResponseDto createPaymentForInvestment(InvestmentRequestDto investmentRequestDto);
    PaymentResponseDto executePayment(String correlationId, InvestmentRequestDto investmentRequestDto);
    PaymentResponseDto getPaymentById(String paymentId);
    List<PaymentResponseDto> getPayments();
}
