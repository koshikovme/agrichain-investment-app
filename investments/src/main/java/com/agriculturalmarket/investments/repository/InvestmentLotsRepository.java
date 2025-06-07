package com.agriculturalmarket.investments.repository;

import com.agriculturalmarket.investments.entity.investment.InvestmentLots;
import com.agriculturalmarket.investments.entity.investment.InvestmentType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentLotsRepository extends JpaRepository<InvestmentLots, Long> {
    Optional<InvestmentLots> findByInvestmentNumber(Long investmentNumber);

    Optional<InvestmentLots> findByAccountNumberAndDescriptionAndInvestmentType(Long accountNumber, String description, InvestmentType investmentType);

    List<InvestmentLots> findAllByAccountNumber(Long accountNumber);

    @Modifying
    @Transactional
    void deleteByInvestmentId(Long investmentId);

    @Modifying
    @Transactional
    void deleteByInvestmentNumber(Long investmentNumber);

}
