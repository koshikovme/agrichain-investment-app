package com.agriculturalmarket.investments.service;

import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.PaymentResponseDto;

import java.util.List;

public interface PaymentsService {
    public PaymentResponseDto createPaymentForInvestment(InvestmentRequestDto investmentRequestDto);
    public PaymentResponseDto executePayment(String correlationId, InvestmentRequestDto investmentRequestDto);
    public List<PaymentResponseDto> getPayments();
}
