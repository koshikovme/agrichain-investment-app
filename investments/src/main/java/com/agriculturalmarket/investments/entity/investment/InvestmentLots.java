package com.agriculturalmarket.investments.entity.investment;


import com.agriculturalmarket.investments.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "investment_lots")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class InvestmentLots extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long investmentId;

    @Column(name = "investment_number", nullable = false)
    private Long investmentNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "investment_type", nullable = false)
    private InvestmentType investmentType;

    @Column(name = "account_number")
    private Long accountNumber;

    @Column(name = "return_conditions")
    private String returnConditions;

    @Column(name = "requirements")
    private String requirements;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "confirmation_type", nullable = false)
    private ConfirmationType confirmationType;

    @Column(name = "documents_url")
    private String documentsUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "investment_status", nullable = false)
    private InvestmentLotStatus investmentLotStatus;
}
