package com.agriculturalmarket.investments.entity.balance;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WalletOperationRequest {
    private Long walletId;
    private WalletOperationType walletOperationType;
    private Long sum;
}
