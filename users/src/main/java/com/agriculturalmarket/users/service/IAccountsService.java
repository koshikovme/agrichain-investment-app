package com.agriculturalmarket.users.service;


import com.agriculturalmarket.users.dto.UserDetailsDto;
import com.agriculturalmarket.users.dto.UsersDto;

import java.util.Map;

public interface IAccountsService {

    Long createAccount(Map<String, Object> claims);

    UsersDto fetchAccount(String mobileNumber);

    UsersDto fetchAccountByAccountNumber(Long accountNumber);

    UserDetailsDto fetchUserDetails(String correlationId, String mobileNumber);

    boolean updateAccount(UsersDto usersDto);

    boolean deleteAccount(String mobileNumber);
}
