package com.agriculturalmarket.investments.dto;

import com.agriculturalmarket.investments.entity.investment.InvestmentStatus;
import com.agriculturalmarket.investments.entity.investment.InvestmentType;
import lombok.Data;

@Data
public class InvestmentsDto {
    private Long investmentNumber;

    private InvestmentType investmentType;

    private Long accountNumber;

    private Long sum;

    private String description;

    private InvestmentStatus investmentStatus;
}
