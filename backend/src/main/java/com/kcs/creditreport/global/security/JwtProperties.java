package com.kcs.creditreport.global.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt") // application.yml에서 설정값을 가져옴
public record JwtProperties(
        String issuer, // JWT 토큰 발급자
        long accessTokenExpirationMinutes, // Access Token 만료 시간
        long refreshTokenExpirationDays, // Refresh Token 만료 시간
        String secret // JWT 토큰 서명 키
) {
}
