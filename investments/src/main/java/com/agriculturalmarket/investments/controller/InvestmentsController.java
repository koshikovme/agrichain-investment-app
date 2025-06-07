package com.agriculturalmarket.investments.controller;

import com.agriculturalmarket.investments.dto.InvestmentsContactInfoDto;
import com.agriculturalmarket.investments.dto.InvestmentLotsDto;
import com.agriculturalmarket.investments.entity.investment.InvestmentApplication;
import com.agriculturalmarket.investments.repository.InvestmentApplicationsRepository;
import com.agriculturalmarket.investments.repository.InvestmentLotsRepository;
import com.agriculturalmarket.investments.service.InvestmentsService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path="/api", produces= MediaType.APPLICATION_JSON_VALUE)
public class InvestmentsController {
    private final InvestmentLotsRepository investmentLotsRepository;
    private final InvestmentApplicationsRepository investmentApplicationsRepository;
    private InvestmentsService investmentsService;
    private final InvestmentsContactInfoDto investmentsContactInfoDto;

    @PostMapping("/publish-investment-lot")
    public Long publishInvestmentLot(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @Valid @RequestBody InvestmentLotsDto investmentLotsDto
    ) {
       return investmentsService.publishInvestmentLot(investmentLotsDto, correlationId);
    }

    @GetMapping("/fetch-investment")
    public InvestmentLotsDto fetchInvestment(@RequestParam Long investmentNumber) {
        return investmentsService.fetchUserInvestmentLot(investmentNumber);
    }

    @GetMapping("/fetch-investments")
    public List<InvestmentLotsDto> fetchInvestments(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long accountNumber
    ) {
        return investmentsService.fetchUserInvestmentLot(correlationId, accountNumber);
    }

    @GetMapping("/fetch-all-investments")
    public List<InvestmentLotsDto> fetchAllInvestments(
            @RequestHeader("agrichain-correlation-id") String correlationId
    ) {
        return investmentsService.fetchAllInvestmentLots(correlationId);
    }

    @GetMapping("/fetch-investments-application")
    public InvestmentApplication fetchInvestmentApplication(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long investmentNumber,
            @RequestParam Long accountNumber
    ) {
        return investmentsService.fetchInvestmentApplication(correlationId, investmentNumber, accountNumber);
    }

    @GetMapping("/fetch-investment-lot-applications")
    public List<InvestmentApplication> fetchInvestmentLotApplications(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long investmentNumber
    ) {
        return investmentsService.fetchInvestmentApplicationsOfInvestmentLot(correlationId, investmentNumber);
    }

    @GetMapping("/fetch-all-investment-applications")
    public List<InvestmentApplication> fetchAllInvestmentApplications(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long accountNumber
    ) {
        return investmentApplicationsRepository.findAllByFarmerId(accountNumber);
    }

    @PostMapping("update-investment")
    public void updateInvestment(InvestmentLotsDto investmentLotsDto) {
        investmentsService.updateInvestmentLot(investmentLotsDto);
    }

    @GetMapping("delete-investment")
    public void deleteInvestment(@RequestParam Long investmentNumber) {
        investmentsService.deleteInvestmentLot(investmentNumber);
    }

    @GetMapping("/contact-info")
    public ResponseEntity<InvestmentsContactInfoDto> getContactInfo() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(investmentsContactInfoDto);
    }
}
