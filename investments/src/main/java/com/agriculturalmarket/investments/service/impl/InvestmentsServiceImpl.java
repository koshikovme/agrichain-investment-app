    package com.agriculturalmarket.investments.service.impl;

    import com.agriculturalmarket.investments.constants.InvestmentsConstants;
    import com.agriculturalmarket.investments.dto.InvestmentApplicationDto;
    import com.agriculturalmarket.investments.dto.InvestmentLotsDto;
    import com.agriculturalmarket.investments.dto.users.UsersDto;
    import com.agriculturalmarket.investments.entity.investment.*;
    import com.agriculturalmarket.investments.exception.ResourceNotFoundException;
    import com.agriculturalmarket.investments.mapper.InvestmentsMapper;
    import com.agriculturalmarket.investments.repository.InvestmentApplicationsRepository;
    import com.agriculturalmarket.investments.repository.InvestmentLotsRepository;
    import com.agriculturalmarket.investments.service.InvestmentsService;
    import com.agriculturalmarket.investments.service.feignclient.UsersFeignClient;
    import com.agriculturalmarket.investments.service.grpcclient.NotificationGrpcClient;
    import grpc.Notification;
    import lombok.AllArgsConstructor;
    import org.springframework.stereotype.Service;

    import java.util.Date;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.stream.Collectors;

    @Service
    @AllArgsConstructor
    public class InvestmentsServiceImpl implements InvestmentsService {
        private final InvestmentLotsRepository investmentLotsRepository;
        private final InvestmentApplicationsRepository investmentApplicationsRepository;
        private final NotificationGrpcClient notificationGrpcClient;
        private final UsersFeignClient usersFeignClient;

        @Override
        public Long publishInvestmentLot(InvestmentLotsDto investmentLotsDto, String correlationId) {
            checkPaymentConfirmation(investmentLotsDto);

            InvestmentLots newInvestment = createNewInvestmentLot(investmentLotsDto);
            investmentLotsRepository.save(newInvestment);

            UsersDto usersDto = usersFeignClient.fetchUserByAccountNumber(correlationId, investmentLotsDto.getAccountNumber()).getBody();
            if (usersDto == null) {
                throw new ResourceNotFoundException("Users", "accountNumber", investmentLotsDto.getAccountNumber().toString());
            }

            sendUserNotification(usersDto, investmentLotsDto);

            return newInvestment.getInvestmentNumber();
        }

        private void checkPaymentConfirmation(InvestmentLotsDto investmentLotsDto) {
            // TODO: Реализовать реальную проверку оплаты/escrow
            if (investmentLotsDto.getDocumentsUrl() == null ||investmentLotsDto.getDocumentsUrl().isEmpty()) {
                throw new IllegalStateException("Оплата не подтверждена");
            }
        }

        @Override
        public void applyForInvestmentLot(InvestmentApplicationDto investmentApplicationDto) {
            InvestmentLots lot = investmentLotsRepository.findByInvestmentNumber(investmentApplicationDto.getLotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Investments", "investmentNumber", investmentApplicationDto.getLotId().toString()));
            if (lot.getInvestmentLotStatus() != InvestmentLotStatus.OPEN) {
                throw new IllegalStateException("Лот не открыт для заявок");
            }
            if (lot.getInvestmentLotStatus().toString().equals(InvestmentLotStatus.UNDER_REVIEW.toString())) {
                throw new IllegalStateException("Лот находится на рассмотрении");
            }

            InvestmentApplication investmentApplication = InvestmentsMapper.applicationToEntity(investmentApplicationDto, new InvestmentApplication());
            investmentApplication.setApplicationStatus(ApplicationStatus.PENDING);
            investmentApplicationsRepository.save(investmentApplication);
        }

        /**
         * Creates a new InvestmentLots entity from the provided InvestmentLotsDto.
         *
         * @param investmentLotsDto the DTO containing investment lot details
         * @return a new InvestmentLots entity
         */

        private InvestmentLots createNewInvestmentLot(InvestmentLotsDto investmentLotsDto) {
            InvestmentLots newInvestment = InvestmentsMapper.lotToEntity(investmentLotsDto, new InvestmentLots());
            newInvestment.setInvestmentLotStatus(InvestmentLotStatus.UNDER_REVIEW);
            long randomInvestmentNumber = 1000000000L + (long) (Math.random() * 9000000000L);
            newInvestment.setInvestmentNumber(randomInvestmentNumber);

            return newInvestment;
        }

        private void sendUserNotification(UsersDto usersDto, InvestmentLotsDto investmentLotsDto) {
            String body = String.format(
                    InvestmentsConstants.INVESTMENT_LOT_PUBLISHING_NOTIFICATION_BODY,
                    usersDto.getName(),                      // имя
                    investmentLotsDto.getDescription(), // название проекта
                    investmentLotsDto.getSum().doubleValue(),        // сумма
                    new Date()                   // дата
            );

            Map<String, String> letter = new HashMap<>();
            letter.put("subject", InvestmentsConstants.INVESTMENT_LOT_PUBLISHING_NOTIFICATION_TITLE);
            letter.put("body", body);

            Notification.UserNotificationRequest userNotificationRequest = Notification.UserNotificationRequest.newBuilder()
                    .setUserId(investmentLotsDto.getAccountNumber())
                    .setEmail("AgriChain@gmail.com")
                    .setName(usersDto.getName())
                    .setType(Notification.NotificationType.INVESTMENT_SUCCESS)
                    .addChannels(Notification.NotificationChannel.WEB)
                    .putAllMetadata(letter)
                    .build();

            notificationGrpcClient.sendUserNotification(userNotificationRequest);
        }


        @Override
        public InvestmentApplication fetchInvestmentApplication(String correlationId, Long investmentNumber, Long farmerId) {
            return investmentApplicationsRepository.findByFarmerIdAndLotId(farmerId, investmentNumber)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Investment Bids",
                            "lotId and farmerId",
                            investmentNumber + " and " + farmerId
                    ));
        }

        @Override
        public InvestmentApplication fetchInvestmentApplication(Long investmentNumber, Long farmerId) {
            return investmentApplicationsRepository.findByFarmerIdAndLotId(farmerId, investmentNumber)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Investment Bids",
                            "lotId and farmerId",
                            investmentNumber + " and " + farmerId
                    ));
        }

        @Override
        public List<InvestmentApplication> fetchInvestmentApplicationsOfInvestmentLot(String correlationId, Long investmentNumber) {
            return investmentApplicationsRepository
                    .findAllByLotId(investmentNumber)
                    .stream()
                    .map(investmentBids -> investmentBids)
                    .toList();
        }

        @Override
        public InvestmentLotsDto fetchUserInvestmentLot(Long investmentNumber) {
            InvestmentLots investmentLots = investmentLotsRepository.findByInvestmentNumber(investmentNumber).orElseThrow(
                    () -> new ResourceNotFoundException("Investments", "investmentNumber", investmentNumber.toString())
            );
            return InvestmentsMapper.lotToDto(investmentLots, new InvestmentLotsDto());
        }

        @Override
        public List<InvestmentLotsDto> fetchAllInvestmentLots(String correlationId) {
            return investmentLotsRepository.findAll().stream()
                    .map(
                            investment -> InvestmentsMapper.lotToDto(investment, new InvestmentLotsDto())
                    )
                    .collect(Collectors.toList());
        }

        @Override
        public List<InvestmentLotsDto> fetchUserInvestmentLot(String correlationId, Long accountNumber) {
            List<InvestmentLots> investments = investmentLotsRepository.findAllByAccountNumber(accountNumber);
            return investments.stream()
                    .map(
                        investment -> InvestmentsMapper.lotToDto(investment, new InvestmentLotsDto())
                    )
                    .collect(Collectors.toList());
        }

        @Override
        public void updateInvestmentLot(InvestmentLotsDto investmentLotsDto) {
            InvestmentLots investmentLots = investmentLotsRepository
                    .findByInvestmentNumber(investmentLotsDto.getInvestmentNumber())
                    .orElseThrow(
                            () -> new ResourceNotFoundException(
                                    "Investments",
                                    "investmentNumber",
                                    investmentLotsDto.getInvestmentNumber().toString()
                            )
                    );
            InvestmentLots updatedInvestment = InvestmentsMapper.lotToEntity(investmentLotsDto, investmentLots);
            investmentLotsRepository.save(updatedInvestment);
        }

        @Override
        public void deleteInvestmentLot(Long investmentNumber) {
            InvestmentLots investmentLots = investmentLotsRepository
                    .findByInvestmentNumber(investmentNumber)
                    .orElseThrow(
                            () -> new ResourceNotFoundException(
                                    "Investments",
                                    "investmentNumber",
                                    investmentNumber.toString()
                            )
                    );
            investmentLotsRepository.deleteByInvestmentNumber(investmentLots.getInvestmentNumber());
        }

        @Override
        public void updateInvestmentApplication(InvestmentApplicationDto investmentApplicationDto) {
            InvestmentApplication investmentApplication = investmentApplicationsRepository
                    .findByFarmerIdAndLotId(investmentApplicationDto.getFarmerId(), investmentApplicationDto.getLotId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Investment Applications",
                            "farmerId and lotId",
                            investmentApplicationDto.getFarmerId() + " and " + investmentApplicationDto.getLotId()
                    ));
            InvestmentApplication updatedInvestmentApplication = InvestmentsMapper.applicationToEntity(investmentApplicationDto, investmentApplication);
            investmentApplicationsRepository.save(updatedInvestmentApplication);
        }

        @Override
        public void deleteInvestmentApplication(Long farmerId, Long lotId) {
            InvestmentApplication investmentApplication = investmentApplicationsRepository
                    .findByFarmerIdAndLotId(farmerId, lotId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Investment Applications",
                            "farmerId and lotId",
                            farmerId + " and " + lotId
                    ));
            investmentApplicationsRepository.deleteByFarmerIdAndLotId(investmentApplication.getFarmerId(), investmentApplication.getLotId());
        }
    }
