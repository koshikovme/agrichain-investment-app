package com.agriculturalmarket.users.controller;

import com.agriculturalmarket.users.constants.UserConstants;
import com.agriculturalmarket.users.dto.ResponseDto;
import com.agriculturalmarket.users.dto.UserDetailsDto;
import com.agriculturalmarket.users.dto.UsersContactInfoDto;
import com.agriculturalmarket.users.dto.UsersDto;
import com.agriculturalmarket.users.repository.AccountsRepository;
import com.agriculturalmarket.users.service.IAccountsService;
import com.agriculturalmarket.users.service.grpcclient.NotificationGrpcClient;
import com.agriculturalmarket.users.utils.Utils;
import com.nimbusds.jwt.SignedJWT;
import grpc.Notification;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path="/api", produces= MediaType.APPLICATION_JSON_VALUE)
@Validated
@AllArgsConstructor
public class AccountsController {
    private static final Logger logger = LoggerFactory.getLogger(AccountsController.class);
    private final NotificationGrpcClient notificationGrpcClient;

    private IAccountsService iAccountsService;
    private final UsersContactInfoDto usersContactInfoDto;
    private final AccountsRepository accountsRepository;

    @PostMapping(path="/create-user")
    public ResponseEntity<Long> createAccount(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        String token;
        Map<String, Object> claims = new HashMap<>();
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.replace("Bearer ", "");
            claims = Utils.decodeJwt(token);
        }

        Long accountNumber = iAccountsService.createAccount(claims);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(accountNumber);
    }


    @GetMapping("/fetch-user")
    public ResponseEntity<UsersDto> fetchUser(@RequestParam @Pattern(regexp="(^$|[0-9]{11})",message = "Mobile number must be 11 digits") String mobileNumber) {
        UsersDto usersDto = iAccountsService.fetchAccount(mobileNumber);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(usersDto);
    }

    @GetMapping("/fetch-user-details")
    public ResponseEntity<UserDetailsDto> fetchUserDetails(
            @RequestHeader("agrichain-correlation-id")
            String correlationId,
            @RequestParam
            @Pattern(regexp="(^$|[0-9]{11})",message = "Mobile number must be 11 digits")
            String mobileNumber) {
        UserDetailsDto userDetailsDto = iAccountsService.fetchUserDetails(correlationId, mobileNumber);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userDetailsDto);
    }


    @GetMapping("/fetch-all-user-details")
    public ResponseEntity<List<UserDetailsDto>> fetchAllUserDetails(
            @RequestHeader("agrichain-correlation-id") String correlationId) {
        List<UserDetailsDto> details = iAccountsService.fetchAllUserDetails(correlationId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(details);
    }



    @PutMapping("/update-user")
    public ResponseEntity<ResponseDto> updateAccountDetails(@Valid @RequestBody UsersDto usersDto) {
        boolean isUpdated = iAccountsService.updateAccount(usersDto);
        if (isUpdated) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ResponseDto(UserConstants.STATUS_200, UserConstants.MESSAGE_200));
        } else {
            return ResponseEntity
                    .status(HttpStatus.EXPECTATION_FAILED)
                    .body(new ResponseDto(UserConstants.STATUS_417, UserConstants.MESSAGE_417_UPDATE));
        }
    }


    @DeleteMapping("/delete-user")
    public ResponseEntity<ResponseDto> deleteAccountDetails(
            @RequestParam
            @Pattern(regexp="(^$|[0-9]{11})",message = "Mobile number must be 11 digits")
            String mobileNumber) {
        boolean isDeleted = iAccountsService.deleteAccount(mobileNumber);
        if (isDeleted) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ResponseDto(UserConstants.STATUS_200, UserConstants.MESSAGE_200));
        } else {
            return ResponseEntity
                    .status(HttpStatus.EXPECTATION_FAILED)
                    .body(new ResponseDto(UserConstants.STATUS_417, UserConstants.MESSAGE_417_DELETE));
        }
    }




    @GetMapping("/contact-info")
    public ResponseEntity<UsersContactInfoDto> getContactInfo() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(usersContactInfoDto);
    }


    @GetMapping("/notify-after-login")
    public void getLoginNotification(
            @RequestParam String accountNumber,
            @RequestParam String username
    ) {
        Notification.AuthNotificationRequest authNotificationRequest = Notification.AuthNotificationRequest.newBuilder()
                .setEmail("Support@AgriChain.kz")
                .setName(username)
                .setUserId(Long.parseLong(accountNumber))
                .build();
        notificationGrpcClient.sendLoginNotification(authNotificationRequest);
    }


    @GetMapping("fetch-user-by-account-number")
    public ResponseEntity<UsersDto> fetchUserByAccountNumber(@RequestParam Long accountNumber) {
        UsersDto usersDto = iAccountsService.fetchAccountByAccountNumber(accountNumber);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(usersDto);
    }


}
