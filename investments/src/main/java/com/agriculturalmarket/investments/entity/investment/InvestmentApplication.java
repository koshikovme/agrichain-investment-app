package com.agriculturalmarket.investments.entity.investment;

import com.agriculturalmarket.investments.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "investment_applications")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class InvestmentApplication extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "lot_id", nullable = false)
    private Long lotId;

    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;

    @Column(name = "proposal", nullable = false)
    private String proposalText;

    @Column(name = "documents_url")
    private String documentsUrl;

    @Column(name = "expected_profit")
    private String expectedProfit;

    @Enumerated(EnumType.STRING)
    @Column(name = "investment_application_status", nullable = false)
    private ApplicationStatus applicationStatus; // PENDING, ACCEPTED, REJECTED
}