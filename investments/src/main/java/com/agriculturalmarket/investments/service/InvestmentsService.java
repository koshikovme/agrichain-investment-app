package com.agriculturalmarket.investments.service;

import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.InvestmentsDto;
import com.agriculturalmarket.investments.entity.payments.PaymentDto;

import java.util.List;

public interface InvestmentsService {
    List<PaymentDto> getPayments();
    Long publishInvestmentLot(InvestmentsDto investmentsDto, String correlationId);
    String invest(InvestmentRequestDto investmentRequestDto);
    InvestmentsDto fetchInvestment(Long investmentId);
    List<InvestmentsDto> fetchAllInvestments(String correlationId);
    List<InvestmentsDto> fetchInvestments(String correlationId, Long accountNumber);
    void updateInvestment(InvestmentsDto investmentsDto);
    void deleteInvestment(Long investmentId);
}
