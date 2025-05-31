package com.agriculturalmarket.users.utils;

import com.nimbusds.jwt.SignedJWT;

import java.util.Map;

public class Utils {
    public static Map<String, Object> decodeJwt(String token) {
        try {
            SignedJWT signedJWT  = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getClaims();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token", e);
        }
    }
}
