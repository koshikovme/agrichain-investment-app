package com.agriculturalmarket.users.service.impl;

import com.agriculturalmarket.users.config.KeycloakAdminProperties;
import com.agriculturalmarket.users.dto.AccountsDto;
import com.agriculturalmarket.users.dto.UserDetailsDto;
import com.agriculturalmarket.users.dto.UsersDto;
import com.agriculturalmarket.users.dto.investments.InvestmentsDto;
import com.agriculturalmarket.users.entity.Role;
import com.agriculturalmarket.users.entity.accounts.Accounts;
import com.agriculturalmarket.users.entity.users.Users;
import com.agriculturalmarket.users.exception.ResourceNotFoundException;
import com.agriculturalmarket.users.exception.UserAlreadyExistsException;
import com.agriculturalmarket.users.mapper.AccountsMapper;
import com.agriculturalmarket.users.mapper.UserMapper;
import com.agriculturalmarket.users.repository.AccountsRepository;
import com.agriculturalmarket.users.repository.UsersRepository;
import com.agriculturalmarket.users.service.IAccountsService;
import com.agriculturalmarket.users.service.client.InvestmentsFeignClient;
import com.agriculturalmarket.users.service.grpcclient.NotificationGrpcClient;
import grpc.Notification;
import lombok.AllArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class AccountsServiceImpl implements IAccountsService {
    private final Keycloak keycloak;
    private final KeycloakAdminProperties keycloakProps;

    private final AccountsRepository accountsRepository;
    private final UsersRepository usersRepository;
    private InvestmentsFeignClient investmentsFeignClient;
    private NotificationGrpcClient notificationGrpcClient;

    @Override
    public Long createAccount(Map<String, Object> claims) {
        Users newUser = UserMapper.fromJWTClaimsToUsers(claims, new Users());
        Optional<Users> optionalUser = usersRepository.findByMobileNumber(newUser.getMobileNumber());
        if (optionalUser.isPresent()) {
            throw new UserAlreadyExistsException("User already registered with given mobile number " + newUser.getMobileNumber());
        }

        Users savedUser = usersRepository.save(newUser);

        String roleStringFromClaim = claims.get("account_type").toString();
        Role userRole;
        if (Objects.equals(Role.ADMINISTRATOR.toString(), roleStringFromClaim)) {
            userRole = Role.ADMINISTRATOR;
        } else if (Objects.equals(Role.FARMERS.toString(), roleStringFromClaim)) {
            userRole = Role.FARMERS;
        } else if (Objects.equals(Role.INVESTORS.toString(), roleStringFromClaim)) {
            userRole = Role.INVESTORS;
        } else {
            throw new IllegalArgumentException("UNKNOWN ROLE");
        }

        Accounts newAccount = createNewAccount(savedUser, userRole);
        accountsRepository.save(newAccount);

        Notification.AuthNotificationRequest authNotificationRequest = Notification.AuthNotificationRequest.newBuilder()
                        .setEmail("Support@AgriChain.kz")
                        .setName(newUser.getName())
                        .setUserId(newAccount.getAccountNumber())
                        .build();
        notificationGrpcClient.sendRegistrationNotification(authNotificationRequest);

        return newAccount.getAccountNumber();
    }


    private Accounts createNewAccount(Users user, Role role) {
        Accounts newAccount = new Accounts();
        newAccount.setUserId(user.getUserId());
        long randomAccountNumber = 1000000000L + (long) (Math.random() * 9000000000L);

        newAccount.setAccountNumber(randomAccountNumber);
        newAccount.setAccountType(role);

        return newAccount;
    }

    @Override
    public UsersDto fetchAccount(String mobileNumber) {
        Users user = usersRepository.findByMobileNumber(mobileNumber).orElseThrow(
                () -> new ResourceNotFoundException("User", "mobileNumber", mobileNumber)
        );

        Accounts accounts = accountsRepository.findByUserId(user.getUserId()).orElseThrow(
                () -> new ResourceNotFoundException("Account", "userId", user.getUserId().toString())
        );

        UsersDto usersDto = UserMapper.toDto(user, new UsersDto());
        usersDto.setAccountsDto(AccountsMapper.toDto(accounts, new AccountsDto()));
        return usersDto;
    }

    @Override
    public UsersDto fetchAccountByAccountNumber(Long accountNumber) {
        Accounts accounts = accountsRepository.findByAccountNumber(accountNumber).orElseThrow(
                () -> new ResourceNotFoundException("Account", "accountNumber", accountNumber.toString())
        );

        Users user = usersRepository.findByUserId(accounts.getUserId()).orElseThrow(
                () -> new ResourceNotFoundException("User", "userId", accounts.getUserId().toString())
        );

        UsersDto usersDto = UserMapper.toDto(user, new UsersDto());
        usersDto.setAccountsDto(AccountsMapper.toDto(accounts, new AccountsDto()));
        return usersDto;
    }

    @Override
    public UserDetailsDto fetchUserDetails(String correlationId, String mobileNumber) {
        UsersDto usersDto = fetchAccount(mobileNumber);
        List<InvestmentsDto> investments = investmentsFeignClient.fetchInvestments(correlationId, usersDto.getAccountsDto().getAccountNumber()).getBody();

        UserDetailsDto userDetailsDto = new UserDetailsDto();
        userDetailsDto.setName(usersDto.getName());
        userDetailsDto.setFirstName(usersDto.getFirstName());
        userDetailsDto.setLastName(usersDto.getLastName());
        userDetailsDto.setEmail(usersDto.getEmail());
        userDetailsDto.setMobileNumber(usersDto.getMobileNumber());
        userDetailsDto.setInvestments(investments);
        userDetailsDto.setAccountsDto(usersDto.getAccountsDto());

        return userDetailsDto;
    }


    @Override
    public boolean updateAccount(UsersDto usersDto) {
        AccountsDto accountsDto = usersDto.getAccountsDto();
        if (accountsDto == null) return false;

        // 1. Обновить аккаунт
        Accounts accounts = accountsRepository
                .findById(accountsDto.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account", "AccountNumber", accountsDto.getAccountNumber().toString()));
        AccountsMapper.toEntity(accounts, accountsDto);
        accounts = accountsRepository.save(accounts);

        // 2. Обновить пользователя
        Long userId = accounts.getUserId();
        Users user = usersRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserID", userId.toString()));
        UserMapper.toEntity(usersDto, user);
        usersRepository.save(user);

        // 3. Синхронизировать с Keycloak
        updateKeycloakUser(user, accounts);

        return true;
    }



    private void updateKeycloakUser(Users user, Accounts accounts) {
        List<UserRepresentation> results = keycloak.realm(keycloakProps.getRealm())
                .users()
                .search(user.getEmail(), 0, 1);

        if (results.isEmpty()) {
            throw new ResourceNotFoundException("Keycloak user", "email", user.getEmail());
        }

        UserResource userResource = keycloak.realm(keycloakProps.getRealm()).users().get(results.get(0).getId());
        UserRepresentation userRep = userResource.toRepresentation();

        userRep.setEmail(user.getEmail());
        userRep.setUsername(user.getName());
        userRep.setFirstName(user.getFirstName());
        userRep.setLastName(user.getLastName());

        Map<String, List<String>> attrs = userRep.getAttributes() != null
                ? userRep.getAttributes()
                : new HashMap<>();
        attrs.put("account_type", List.of(accounts.getAccountType().toString()));
        attrs.put("mobile_number", List.of(user.getMobileNumber()));
        userRep.setAttributes(attrs);

        userResource.update(userRep);
    }



    @Override
    public boolean deleteAccount(String mobileNumber) {
        Users user = usersRepository.findByMobileNumber(mobileNumber).orElseThrow(
                () -> new ResourceNotFoundException("User", "mobileNumber", mobileNumber)
        );
        accountsRepository.deleteByUserId(user.getUserId());
        usersRepository.deleteByUserId(user.getUserId());

        return true;
    }
}
