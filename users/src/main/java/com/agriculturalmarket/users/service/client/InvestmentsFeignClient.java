package com.agriculturalmarket.users.service.client;

import com.agriculturalmarket.users.dto.investments.InvestmentsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


@FeignClient(name = "investments")
public interface InvestmentsFeignClient {
    @GetMapping(value = "/api/fetch-investments", consumes = "application/json")
    ResponseEntity<List<InvestmentsDto>> fetchInvestments(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long accountNumber
    );
}
