package com.agriculturalmarket.users.dto.investments;

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
