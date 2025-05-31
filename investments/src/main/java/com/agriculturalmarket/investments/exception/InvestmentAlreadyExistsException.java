package com.agriculturalmarket.investments.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvestmentAlreadyExistsException extends RuntimeException {
    public InvestmentAlreadyExistsException(String message) {
        super(message);
    }
}
