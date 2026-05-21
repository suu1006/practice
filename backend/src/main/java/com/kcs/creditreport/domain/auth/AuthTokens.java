package com.kcs.creditreport.domain.auth;

public record AuthTokens(
        String accessToken,
        String refreshToken,
        User user
) {
}
