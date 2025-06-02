package com.agriculturalmarket.investments.service.impl;

import com.agriculturalmarket.investments.constants.InvestmentsConstants;
import com.agriculturalmarket.investments.dto.InvestmentRequestDto;
import com.agriculturalmarket.investments.dto.InvestmentsDto;
import com.agriculturalmarket.investments.dto.users.AccountsDto;
import com.agriculturalmarket.investments.dto.users.UsersDto;
import com.agriculturalmarket.investments.entity.investment.InvestmentStatus;
import com.agriculturalmarket.investments.entity.investment.Investments;
import com.agriculturalmarket.investments.entity.payments.PaymentDto;
import com.agriculturalmarket.investments.exception.ResourceNotFoundException;
import com.agriculturalmarket.investments.mapper.InvestmentsMapper;
import com.agriculturalmarket.investments.mapper.PaymentsMapper;
import com.agriculturalmarket.investments.repository.InvestmentsRepository;
import com.agriculturalmarket.investments.service.InvestmentsService;
import com.agriculturalmarket.investments.service.feignclient.UsersFeignClient;
import com.agriculturalmarket.investments.service.grpcclient.NotificationGrpcClient;
import com.agriculturalmarket.investments.service.grpcclient.PaymentGrpcClient;
import grpc.Notification;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import payment.Payment;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InvestmentsServiceImpl implements InvestmentsService {
    private final InvestmentsRepository investmentsRepository;
    private final PaymentGrpcClient paymentGrpcClient;
    private final NotificationGrpcClient notificationGrpcClient;
    private final UsersFeignClient usersFeignClient;


    @Override
    public List<PaymentDto> getPayments() {
        Payment.ListPaymentsRequest listPaymentsRequest = Payment.ListPaymentsRequest.newBuilder()
                .setPage(1)
                .setPageSize(10)
                .build();

        Payment.ListPaymentsResponse paymentsResponse = paymentGrpcClient.listOfPayments(listPaymentsRequest);

        List<Payment.PaymentResponse> paymentsList = paymentsResponse.getPaymentsList();

        return paymentsList.stream()
                .map(
                        payment -> PaymentsMapper.toDto(payment, new PaymentDto())
                )
                .collect(Collectors.toList());
    }

    @Override
    public Long publishInvestmentLot(InvestmentsDto investmentsDto, String correlationId) {
        Investments newInvestment = createNewInvestment(investmentsDto);
        investmentsRepository.save(newInvestment);

        UsersDto usersDto = usersFeignClient.fetchUserByAccountNumber(correlationId, investmentsDto.getAccountNumber()).getBody();
        String body = String.format(
                InvestmentsConstants.INVESTMENT_LOT_PUBLISHING_NOTIFICATION_BODY,
                usersDto.getName(),                      // имя
                investmentsDto.getDescription(), // название проекта
                investmentsDto.getSum().doubleValue(),        // сумма
                new Date()                   // дата
        );

        Map<String, String> letter = new HashMap<>();
        letter.put("subject", InvestmentsConstants.INVESTMENT_LOT_PUBLISHING_NOTIFICATION_TITLE);
        letter.put("body", body);

        Notification.UserNotificationRequest userNotificationRequest = Notification.UserNotificationRequest.newBuilder()
                .setUserId(newInvestment.getAccountNumber())
                .setEmail("AgriChain@gmail.com")
                .setName(usersDto.getName())
                .setType(Notification.NotificationType.OTHER)
                .addChannels(Notification.NotificationChannel.WEB) // <- fix here
                .putAllMetadata(letter) // <- don't forget to pass metadata if needed
                .build();

        notificationGrpcClient.sendUserNotification(userNotificationRequest);

        return newInvestment.getInvestmentNumber();
    }

    private Investments createNewInvestment(InvestmentsDto investmentsDto) {
        Investments newInvestment = new Investments();
        newInvestment.setDescription(investmentsDto.getDescription());
        newInvestment.setInvestmentType(investmentsDto.getInvestmentType());
        newInvestment.setAmount(investmentsDto.getSum());
        newInvestment.setAccountNumber(investmentsDto.getAccountNumber());
        newInvestment.setInvestmentStatus(investmentsDto.getInvestmentStatus());

        long randomInvestmentNumber = 1000000000L + (long) (Math.random() * 9000000000L);
        newInvestment.setInvestmentNumber(randomInvestmentNumber);

        return newInvestment;
    }

    @Override
    public String invest(InvestmentRequestDto investmentRequestDto) {
        Payment.PaymentResponse createPaymentResponse = createPayment(investmentRequestDto);
        return createPaymentResponse.getPaypalUrl();
    }

    private Payment.PaymentResponse createPayment(InvestmentRequestDto investmentRequestDto) {
        InvestmentsDto targetInvestment = fetchInvestment(investmentRequestDto.getInvestmentNumber());

        Payment.CreatePaymentRequest createPaymentRequest = Payment.CreatePaymentRequest.newBuilder()
                .setAmount(((double) targetInvestment.getSum()))
                .setCurrency(investmentRequestDto.getCurrency())
                .setDescription(targetInvestment.getDescription())
                .build();

        Payment.PaymentResponse  paymentResponse = paymentGrpcClient.createPayment(createPaymentRequest);

        if (paymentResponse != null && paymentResponse.getErrorCode().isEmpty()) {
            Payment.ExecutePaymentRequest executePaymentRequest = Payment.ExecutePaymentRequest.newBuilder()
                    .setPaymentId(paymentResponse.getPaymentId())
                    .setPayerId(paymentResponse.getPayerId())
                    .build();

            Payment.PaymentResponse executePayment = paymentGrpcClient.executePayment(executePaymentRequest);
            if (executePayment.getStatus().equals("completed")) {
                targetInvestment.setInvestmentStatus(InvestmentStatus.INVESTED);
                updateInvestment(targetInvestment);
            } else {
                throw new RuntimeException("Payment execution failed: " + executePayment.getErrorMessage());
            }

            targetInvestment.setInvestmentStatus(InvestmentStatus.INVESTED);
            updateInvestment(targetInvestment);
        }

        return paymentResponse;
    }



    @Override
    public InvestmentsDto fetchInvestment(Long investmentNumber) {
        Investments investments = investmentsRepository.findByInvestmentNumber(investmentNumber).orElseThrow(
                () -> new ResourceNotFoundException("Investments", "investmentNumber", investmentNumber.toString())
        );
        return InvestmentsMapper.toDto(investments, new InvestmentsDto());
    }

    @Override
    public List<InvestmentsDto> fetchAllInvestments(String correlationId) {
        return investmentsRepository.findAll().stream()
                .map(
                        investment -> InvestmentsMapper.toDto(investment, new InvestmentsDto())
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<InvestmentsDto> fetchInvestments(String correlationId, Long accountNumber) {
        List<Investments> investments = investmentsRepository.findAllByAccountNumber(accountNumber);
        return investments.stream()
                .map(
                    investment -> InvestmentsMapper.toDto(investment, new InvestmentsDto())
                )
                .collect(Collectors.toList());
    }

    @Override
    public void updateInvestment(InvestmentsDto investmentsDto) {
        Investments investments = investmentsRepository
                .findByInvestmentNumber(investmentsDto.getInvestmentNumber())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Investments",
                                "investmentNumber",
                                investmentsDto.getInvestmentNumber().toString()
                        )
                );
        Investments updatedInvestment = InvestmentsMapper.toEntity(investmentsDto, investments);
        investmentsRepository.save(updatedInvestment);
    }

    @Override
    public void deleteInvestment(Long investmentNumber) {
        Investments investments = investmentsRepository
                .findByInvestmentNumber(investmentNumber)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Investments",
                                "investmentNumber",
                                investmentNumber.toString()
                        )
                );
        investmentsRepository.deleteByInvestmentNumber(investments.getInvestmentNumber());
    }
}
