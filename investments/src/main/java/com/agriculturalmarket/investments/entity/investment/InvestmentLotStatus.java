package com.agriculturalmarket.investments.entity.investment;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum InvestmentLotStatus {
    OPEN,
    UNDER_REVIEW,
    CLOSED,
    REJECTED
}
