package com.agriculturalmarket.investments.mapper;

import com.agriculturalmarket.investments.dto.WalletsDto;
import com.agriculturalmarket.investments.entity.balance.Wallets;

public class WalletsMapper {
    public static Wallets toEntity(WalletsDto walletsDto, Wallets wallet) {
        wallet.setBalance(walletsDto.getBalance());
        return wallet;
    }

    public static WalletsDto toDto(WalletsDto walletDto, Wallets wallet) {
        walletDto.setBalance(wallet.getBalance());
        return walletDto;
    }
}
