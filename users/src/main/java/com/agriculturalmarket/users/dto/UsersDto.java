package com.agriculturalmarket.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsersDto {
    @NotEmpty(message = "E-mail can not be a null or empty")
    @Email(message = "E-mail address should be a valid value")
    private String email;
    @NotEmpty(message = "mobileNumber can not be a null or empty")
    @Pattern(regexp = "(^$|[0-9]{11})", message = "Mobile number must be 11 digits")
    private String mobileNumber;
    @NotEmpty(message = "Name can not be a null or empty")
    @Size(min = 5, max = 30, message = "The length of the user name should be between 5 and 30")
    private String name;
    private String firstName;
    private String lastName;
    private AccountsDto accountsDto;
}
