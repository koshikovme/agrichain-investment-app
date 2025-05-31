package com.agriculturalmarket.investments.service.feignclient;

import com.agriculturalmarket.investments.dto.users.AccountsDto;
import com.agriculturalmarket.investments.dto.users.UsersDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "users")
public interface UsersFeignClient {
    @GetMapping(value = "/api/fetch-user", consumes = "application/json")
    ResponseEntity<AccountsDto> fetchAccountDetails(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam String mobileNumber
    );

    @GetMapping(value = "/api/fetch-user-by-account-number", consumes = "application/json")
    ResponseEntity<UsersDto> fetchUserByAccountNumber(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long accountNumber
    );
}
