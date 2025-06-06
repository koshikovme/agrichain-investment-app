package com.agriculturalmarket.users.dto.investments;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InvestmentLotsDto {
    private Long investmentNumber;

    private InvestmentType investmentType;

    private Long accountNumber;

    private Long sum;

    private String description;

    private String returnConditions;

    private String requirements;

    private String documentsUrl;

    private LocalDateTime deadline;

    private ConfirmationType confirmationType;

    private InvestmentLotStatus investmentStatus;
}
