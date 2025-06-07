package com.agriculturalmarket.investments.repository;

import com.agriculturalmarket.investments.entity.investment.InvestmentApplication;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentApplicationsRepository extends JpaRepository<InvestmentApplication, Long> {
    List<InvestmentApplication> findAllByLotId(Long lotId);

    Optional<InvestmentApplication> findByFarmerIdAndLotId(Long farmerId, Long lotId);

    List<InvestmentApplication> findAllByFarmerId(Long farmerId);

    @Modifying
    @Transactional
    void deleteByFarmerIdAndLotId(Long farmerId, Long lotId);
}
