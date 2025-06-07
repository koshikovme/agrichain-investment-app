package com.agriculturalmarket.investments.dto;

import com.agriculturalmarket.investments.entity.investment.ApplicationStatus;
import lombok.Data;

@Data
public class InvestmentApplicationDto {
    private Long lotId;
    private Long farmerId;
    private String proposalText;
    private String documentsUrl;
    private String expectedProfit;
    private ApplicationStatus applicationStatus;
}
