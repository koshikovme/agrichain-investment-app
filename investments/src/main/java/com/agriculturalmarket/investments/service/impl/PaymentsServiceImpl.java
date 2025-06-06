package com.agriculturalmarket.investments.service.impl;

import com.agriculturalmarket.investments.dto.InvestmentLotsDto;
import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.PaymentResponseDto;
import com.agriculturalmarket.investments.entity.investment.InvestmentLotStatus;
import com.agriculturalmarket.investments.mapper.PaymentsMapper;
import com.agriculturalmarket.investments.repository.InvestmentApplicationsRepository;
import com.agriculturalmarket.investments.service.InvestmentsService;
import com.agriculturalmarket.investments.service.PaymentsService;
import com.agriculturalmarket.investments.service.grpcclient.NotificationGrpcClient;
import com.agriculturalmarket.investments.service.grpcclient.PaymentGrpcClient;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import payment.Payment;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PaymentsServiceImpl implements PaymentsService {

    private final InvestmentApplicationsRepository investmentApplicationsRepository;
    private final PaymentGrpcClient paymentGrpcClient;
    private final NotificationGrpcClient notificationGrpcClient;
    private final InvestmentsService investmentsService;

    @Override
    public PaymentResponseDto createPaymentForInvestment(InvestmentRequestDto investmentRequestDto) {
        Payment.PaymentResponse createPaymentResponse = createPayment(investmentRequestDto);
        return PaymentsMapper.toDto(createPaymentResponse);
    }

    private Payment.PaymentResponse createPayment(InvestmentRequestDto investmentRequestDto) {
        InvestmentLotsDto targetInvestment = investmentsService.fetchUserInvestmentLot(investmentRequestDto.getInvestmentNumber());

        Payment.CreatePaymentRequest createPaymentRequest = Payment.CreatePaymentRequest.newBuilder()
                .setAmount(((double) targetInvestment.getSum()))
                .setCurrency(investmentRequestDto.getCurrency())
                .setDescription(targetInvestment.getDescription())
                .build();

        return paymentGrpcClient.createPayment(createPaymentRequest);
    }

    @Override
    public PaymentResponseDto executePayment(String correlationId, InvestmentRequestDto investmentRequestDto) {
        Payment.PaymentResponse executePaymentResponse = executePayment(investmentRequestDto);
        return PaymentsMapper.toDto(executePaymentResponse);
    }

    private Payment.PaymentResponse executePayment(InvestmentRequestDto investmentRequestDto) {
        PaymentResponseDto paymentResponseDto = investmentRequestDto.getPaymentResponseDto();
        InvestmentLotsDto targetInvestment = investmentsService.fetchUserInvestmentLot(investmentRequestDto.getInvestmentNumber());

        if (paymentResponseDto != null && paymentResponseDto.getErrorCode().isEmpty()) {
            Payment.ExecutePaymentRequest executePaymentRequest = Payment.ExecutePaymentRequest.newBuilder()
                    .setPaymentId(paymentResponseDto.getPaymentId())
                    .setPayerId(paymentResponseDto.getPayerId())
                    .build();

            Payment.PaymentResponse executePayment = paymentGrpcClient.executePayment(executePaymentRequest);
            if (executePayment.getStatus().equalsIgnoreCase("completed")) {
                targetInvestment.setInvestmentStatus(InvestmentLotStatus.OPEN);
            } else {
                targetInvestment.setInvestmentStatus(InvestmentLotStatus.CLOSED);
            }
            return executePayment;
        } else {
            throw new RuntimeException("Payment execution failed: " + paymentResponseDto.getErrorMessage());
        }
    }

    @Override
    public List<PaymentResponseDto> getPayments() {
        Payment.ListPaymentsRequest listPaymentsRequest = Payment.ListPaymentsRequest.newBuilder()
                .setPage(1)
                .setPageSize(10)
                .build();

        Payment.ListPaymentsResponse paymentsResponse = paymentGrpcClient.listOfPayments(listPaymentsRequest);

        List<Payment.PaymentResponse> paymentsList = paymentsResponse.getPaymentsList();

        return paymentsList.stream()
                .map(
                        payment -> PaymentsMapper.toDto(payment)
                )
                .collect(Collectors.toList());
    }
}
