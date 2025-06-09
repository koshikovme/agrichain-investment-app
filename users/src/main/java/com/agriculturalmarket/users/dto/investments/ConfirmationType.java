package com.agriculturalmarket.users.dto.investments;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum ConfirmationType {
    PAYMENT,
    CHECK,
    ESCROW,
    NFT
}
