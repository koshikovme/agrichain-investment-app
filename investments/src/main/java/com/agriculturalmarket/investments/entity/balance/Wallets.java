package com.agriculturalmarket.investments.entity.balance;

import com.agriculturalmarket.investments.entity.BaseEntity;
import com.agriculturalmarket.investments.entity.investment.InvestmentType;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "wallets")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Wallets extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long walletId;

    @Column(name = "account_number")
    private Long accountNumber;

    @Column(name = "balance")
    private Long balance;
}