package com.agriculturalmarket.users.dto.investments;

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
