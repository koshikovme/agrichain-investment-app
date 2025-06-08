package com.agriculturalmarket.investments.entity.investment;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum InvestmentType {
    CATTLE,
    EQUIPMENT,
    CASH,
    LAND
}
