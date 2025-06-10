package com.agriculturalmarket.users.dto.investments;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum InvestmentLotStatus {
    OPEN,
    UNDER_REVIEW,
    CLOSED,
    REJECTED,
    IN_WORK
}
