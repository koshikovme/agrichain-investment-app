package com.agriculturalmarket.users.mapper;

import com.agriculturalmarket.users.dto.UsersDto;
import com.agriculturalmarket.users.entity.Role;
import com.agriculturalmarket.users.entity.users.Users;

import java.util.Map;

public class UserMapper {
    public static Users toEntity(UsersDto usersDto, Users user) {
        user.setName(usersDto.getName());
        user.setEmail(usersDto.getEmail());
        user.setMobileNumber(usersDto.getMobileNumber());
        user.setFirstName(usersDto.getFirstName());
        user.setLastName(usersDto.getLastName());
        return user;
    }

    public static UsersDto toDto(Users user, UsersDto usersDto) {
        usersDto.setEmail(user.getEmail());
        usersDto.setName(user.getName());
        usersDto.setFirstName(user.getFirstName());
        usersDto.setLastName(user.getLastName());
        usersDto.setMobileNumber(user.getMobileNumber());
        return usersDto;
    }


    public static Users fromJWTClaimsToUsers(Map<String, Object> claims, Users newUser) {
        newUser.setMobileNumber(claims.get("mobile_number").toString());
        newUser.setName(claims.get("preferred_username").toString());
        newUser.setEmail(claims.get("email").toString());

        return newUser;
    }


}
