package com.agriculturalmarket.investments.entity.investment;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum ApplicationStatus {
    PENDING,   // Bid is awaiting review
    ACCEPTED,  // Bid has been accepted by the farmer
    REJECTED,  // Bid has been rejected by the farmer
    CANCELLED, // Bid has been cancelled by the investor or system
    EXPIRED;   // Bid has expired without action
}
