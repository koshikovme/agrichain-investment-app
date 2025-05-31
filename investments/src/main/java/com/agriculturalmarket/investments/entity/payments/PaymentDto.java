package com.agriculturalmarket.investments.entity.payments;

import lombok.Data;

@Data
public class PaymentDto {
    String id;
    String paymentId;
    double amount;
    String currency;
    String status;
    String description;
}
