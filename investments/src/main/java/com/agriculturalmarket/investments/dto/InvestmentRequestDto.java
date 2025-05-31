package com.agriculturalmarket.investments.dto;

import lombok.Data;

@Data
public class InvestmentRequestDto {
   private Long walletId;
   private Long investmentNumber;
   private Long accountNumber;
   private String currency;
   private String mobileNumber;
}
