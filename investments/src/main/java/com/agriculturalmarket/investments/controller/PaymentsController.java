package com.agriculturalmarket.investments.controller;

import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.PaymentResponseDto;
import com.agriculturalmarket.investments.service.PaymentsService;
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
public class PaymentsController {

    private final PaymentsService paymentsService;


    @PostMapping("/create-payment")
    public PaymentResponseDto invest(@Valid @RequestBody InvestmentRequestDto investmentRequestDto) {
        return paymentsService.createPaymentForInvestment(investmentRequestDto);
    }

    @PostMapping("/execute-payment")
    public ResponseEntity<PaymentResponseDto> executePayment(
            @RequestHeader("agrichain-correlation-id") String correlationId,
            @Valid @RequestBody InvestmentRequestDto investmentRequestDto
    ) {
        PaymentResponseDto paymentResponseDto = paymentsService.executePayment(correlationId, investmentRequestDto);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(paymentResponseDto);
    }

    @GetMapping("/get-payments")
    public List<PaymentResponseDto> getPayments() {
        return paymentsService.getPayments();
    }
}
