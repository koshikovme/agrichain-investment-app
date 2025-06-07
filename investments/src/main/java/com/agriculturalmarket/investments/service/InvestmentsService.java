package com.agriculturalmarket.investments.service;

import com.agriculturalmarket.investments.dto.InvestmentApplicationDto;
import com.agriculturalmarket.investments.dto.InvestmentLotsDto;
import com.agriculturalmarket.investments.entity.investment.InvestmentApplication;

import java.util.List;

public interface InvestmentsService {
    Long publishInvestmentLot(InvestmentLotsDto investmentLotsDto, String correlationId);
    void applyForInvestmentLot(InvestmentApplicationDto investmentApplicationDto);
    InvestmentApplication fetchInvestmentApplication(String correlationId, Long investmentNumber, Long farmerId);
    InvestmentApplication fetchInvestmentApplication(Long investmentNumber, Long farmerId);
    List<InvestmentApplication> fetchInvestmentApplicationsOfInvestmentLot(String correlationId, Long investmentNumber);
    InvestmentLotsDto fetchUserInvestmentLot(Long investmentId);
    List<InvestmentLotsDto> fetchAllInvestmentLots(String correlationId);
    List<InvestmentLotsDto> fetchUserInvestmentLot(String correlationId, Long accountNumber);
    void updateInvestmentLot(InvestmentLotsDto investmentLotsDto);
    void deleteInvestmentLot(Long investmentId);
    void updateInvestmentApplication(InvestmentApplicationDto investmentApplicationDto);
    void deleteInvestmentApplication(Long farmerId, Long lotId);
}
