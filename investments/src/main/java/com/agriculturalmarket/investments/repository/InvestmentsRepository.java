package com.agriculturalmarket.investments.repository;

import com.agriculturalmarket.investments.entity.investment.InvestmentType;
import com.agriculturalmarket.investments.entity.investment.Investments;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentsRepository extends JpaRepository<Investments, Long> {
    Optional<Investments> findByInvestmentNumber(Long investmentNumber);

    Optional<Investments> findByAccountNumberAndDescriptionAndInvestmentType(Long accountNumber, String description, InvestmentType investmentType);

    List<Investments> findAllByAccountNumber(Long accountNumber);

    @Modifying
    @Transactional
    void deleteByInvestmentId(Long investmentId);

    @Modifying
    @Transactional
    void deleteByInvestmentNumber(Long investmentNumber);

}
