package com.agriculturalmarket.users.mapper;

import com.agriculturalmarket.users.dto.AccountsDto;
import com.agriculturalmarket.users.entity.accounts.Accounts;

public class AccountsMapper {
    public static AccountsDto toDto(Accounts accounts, AccountsDto accountsDto) {
        accountsDto.setAccountNumber(accounts.getAccountNumber());
        accountsDto.setAccountType(accounts.getAccountType());
        return accountsDto;
    }

    public static Accounts toEntity(Accounts accounts, AccountsDto accountsDto) {
        accounts.setAccountNumber(accountsDto.getAccountNumber());
        accounts.setAccountType(accountsDto.getAccountType());
        return accounts;
    }
}
