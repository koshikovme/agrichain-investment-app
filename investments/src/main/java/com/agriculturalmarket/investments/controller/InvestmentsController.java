package com.agriculturalmarket.investments.controller;

import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.InvestmentsContactInfoDto;
import com.agriculturalmarket.investments.dto.InvestmentsDto;
import com.agriculturalmarket.investments.entity.payments.PaymentDto;
import com.agriculturalmarket.investments.repository.InvestmentsRepository;
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
    private final InvestmentsRepository investmentsRepository;
    private InvestmentsService investmentsService;
    private final InvestmentsContactInfoDto investmentsContactInfoDto;

    @PostMapping("/publish-investment-lot")
    public Long publishInvestmentLot(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @Valid @RequestBody InvestmentsDto investmentsDto
    ) {
       return investmentsService.publishInvestmentLot(investmentsDto, correlationId);
    }

    @GetMapping("/fetch-investment")
    public InvestmentsDto fetchInvestment(@RequestParam Long investmentNumber) {
        return investmentsService.fetchInvestment(investmentNumber);
    }

    @GetMapping("/fetch-investments")
    public List<InvestmentsDto> fetchInvestments(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @RequestParam Long accountNumber
    ) {
        return investmentsService.fetchInvestments(correlationId, accountNumber);
    }

    @GetMapping("/fetch-all-investments")
    public List<InvestmentsDto> fetchAllInvestments(
            @RequestHeader("agrichain-correlation-id") String correlationId
    ) {
        return investmentsService.fetchAllInvestments(correlationId);
    }

    @PostMapping("/invest")
    public String invest(@Valid @RequestBody InvestmentRequestDto investmentRequestDto) {
        return investmentsService.invest(investmentRequestDto);
    }

    @PostMapping("update-investment")
    public void updateInvestment(InvestmentsDto investmentsDto) {
        investmentsService.updateInvestment(investmentsDto);
    }

    @GetMapping("delete-investment")
    public void deleteInvestment(@RequestParam Long investmentNumber) {
        investmentsService.deleteInvestment(investmentNumber);
    }

    @GetMapping("/contact-info")
    public ResponseEntity<InvestmentsContactInfoDto> getContactInfo() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(investmentsContactInfoDto);
    }

    @GetMapping("/get-payments")
    public List<PaymentDto> getPayments() {
        return investmentsService.getPayments();
    }
}
