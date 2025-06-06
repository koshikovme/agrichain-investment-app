package com.agriculturalmarket.investments.mapper;

import com.agriculturalmarket.investments.dto.InvestmentApplicationDto;
import com.agriculturalmarket.investments.dto.InvestmentLotsDto;
import com.agriculturalmarket.investments.entity.investment.InvestmentApplication;
import com.agriculturalmarket.investments.entity.investment.InvestmentLots;

public class InvestmentsMapper {
    public static InvestmentLots lotToEntity(InvestmentLotsDto investmentLotsDto, InvestmentLots investmentLots) {
        investmentLots.setInvestmentNumber(investmentLotsDto.getInvestmentNumber());
        investmentLots.setInvestmentType(investmentLotsDto.getInvestmentType());
        investmentLots.setAmount(investmentLotsDto.getSum());
        investmentLots.setAccountNumber(investmentLotsDto.getAccountNumber());
        investmentLots.setDescription(investmentLotsDto.getDescription());
        investmentLots.setInvestmentLotStatus(investmentLotsDto.getInvestmentStatus());
        investmentLots.setDeadline(investmentLotsDto.getDeadline());
        investmentLots.setRequirements(investmentLotsDto.getRequirements());
        investmentLots.setConfirmationType(investmentLotsDto.getConfirmationType());
        investmentLots.setReturnConditions(investmentLotsDto.getReturnConditions());
        investmentLots.setDocumentsUrl(investmentLotsDto.getDocumentsUrl());
        return investmentLots;
    }

    public static InvestmentLotsDto lotToDto(InvestmentLots investmentLots, InvestmentLotsDto investmentLotsDto) {
        investmentLotsDto.setInvestmentNumber(investmentLots.getInvestmentNumber());
        investmentLotsDto.setInvestmentType(investmentLots.getInvestmentType());
        investmentLotsDto.setSum(investmentLots.getAmount());
        investmentLotsDto.setAccountNumber(investmentLots.getAccountNumber());
        investmentLotsDto.setDescription(investmentLots.getDescription());
        investmentLotsDto.setSum(investmentLots.getAmount());
        investmentLotsDto.setInvestmentStatus(investmentLots.getInvestmentLotStatus());
        investmentLotsDto.setDeadline(investmentLots.getDeadline());
        investmentLotsDto.setRequirements(investmentLots.getRequirements());
        investmentLotsDto.setConfirmationType(investmentLots.getConfirmationType());
        investmentLotsDto.setReturnConditions(investmentLots.getReturnConditions());
        return investmentLotsDto;
    }


    public static InvestmentApplication applicationToEntity(InvestmentApplicationDto investmentApplicationDto, InvestmentApplication investmentApplication) {
        investmentApplication.setProposalText(investmentApplicationDto.getProposalText());
        investmentApplication.setDocumentsUrl(investmentApplicationDto.getDocumentsUrl());
        investmentApplication.setExpectedProfit(investmentApplicationDto.getExpectedProfit());
        investmentApplication.setApplicationStatus(investmentApplicationDto.getApplicationStatus());
        investmentApplication.setLotId(investmentApplicationDto.getLotId());
        investmentApplication.setFarmerId(investmentApplicationDto.getFarmerId());

        return investmentApplication;
    }

    public static InvestmentApplication applicationToDto(InvestmentApplicationDto investmentApplicationDto, InvestmentApplication investmentApplication) {
        investmentApplicationDto.setProposalText(investmentApplication.getProposalText());
        investmentApplicationDto.setDocumentsUrl(investmentApplication.getDocumentsUrl());
        investmentApplicationDto.setExpectedProfit(investmentApplication.getExpectedProfit());
        investmentApplicationDto.setApplicationStatus(investmentApplication.getApplicationStatus());
        investmentApplicationDto.setLotId(investmentApplication.getLotId());
        investmentApplicationDto.setFarmerId(investmentApplication.getFarmerId());

        return investmentApplication;
    }


}
