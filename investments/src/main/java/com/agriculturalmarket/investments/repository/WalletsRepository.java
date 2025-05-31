package com.agriculturalmarket.investments.repository;

import com.agriculturalmarket.investments.entity.balance.Wallets;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletsRepository extends JpaRepository<Wallets, Long> {
    Optional<Wallets> findByWalletId(Long walletId);
    Optional<Wallets> findByAccountNumber(Long accountNumber);

    @Transactional
    @Modifying
    void deleteByWalletId(Long walletId);
}
