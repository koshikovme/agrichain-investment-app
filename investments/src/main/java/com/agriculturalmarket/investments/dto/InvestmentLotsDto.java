package com.agriculturalmarket.investments.dto;

import com.agriculturalmarket.investments.entity.investment.ConfirmationType;
import com.agriculturalmarket.investments.entity.investment.InvestmentLotStatus;
import com.agriculturalmarket.investments.entity.investment.InvestmentType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
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

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate deadline;

    private ConfirmationType confirmationType;

    private InvestmentLotStatus investmentStatus;
}
