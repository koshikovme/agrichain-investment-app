package com.agriculturalmarket.investments.mapper;

import com.agriculturalmarket.investments.dto.InvestmentsDto;
import com.agriculturalmarket.investments.entity.investment.Investments;

public class InvestmentsMapper {
    public static Investments toEntity(InvestmentsDto investmentsDto, Investments investments) {
        investments.setInvestmentNumber(investmentsDto.getInvestmentNumber());
        investments.setInvestmentType(investmentsDto.getInvestmentType());
        investments.setAmount(investmentsDto.getSum());
        investments.setAccountNumber(investmentsDto.getAccountNumber());
        investments.setDescription(investmentsDto.getDescription());
        investments.setInvestmentStatus(investmentsDto.getInvestmentStatus());
        return investments;
    }

    public static InvestmentsDto toDto(Investments investments, InvestmentsDto investmentsDto) {
        investmentsDto.setInvestmentNumber(investments.getInvestmentNumber());
        investmentsDto.setInvestmentType(investments.getInvestmentType());
        investmentsDto.setSum(investments.getAmount());
        investmentsDto.setAccountNumber(investments.getAccountNumber());
        investmentsDto.setDescription(investments.getDescription());
        investmentsDto.setSum(investments.getAmount());
        investmentsDto.setInvestmentStatus(investments.getInvestmentStatus());
        return investmentsDto;
    }


}
