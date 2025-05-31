package com.agriculturalmarket.investments.entity.investment;


import com.agriculturalmarket.investments.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "investments")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Investments extends BaseEntity {
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

    @Column(name = "amount")
    private Long amount;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "investment_status", nullable = false)
    private InvestmentStatus investmentStatus;
}
