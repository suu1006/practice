package com.kcs.creditreport.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

    private static final String TOKEN_TYPE_CLAIM = "type";

    private final JwtProperties properties;
    private final SecretKey secretKey;

    public JwtProvider(JwtProperties properties) {
        this.properties = properties;
        this.secretKey = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(String email) {
        return createToken(email, TokenType.ACCESS, Duration.ofMinutes(properties.accessTokenExpirationMinutes()));
    }

    public String createRefreshToken(String email) {
        return createToken(email, TokenType.REFRESH, Duration.ofDays(properties.refreshTokenExpirationDays()));
    }

    public String getSubject(String token, TokenType expectedTokenType) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(properties.issuer())
                .build()
                .parseSignedClaims(token) // 서명 ,issuer, 만료시간 검증
                .getPayload();

        String tokenType = claims.get(TOKEN_TYPE_CLAIM, String.class);
        if (!expectedTokenType.name().equals(tokenType)) {
            throw new JwtException("토큰 타입이 올바르지 않습니다.");
        }

        return claims.getSubject();
    }

    // Refresh Token 만료 시간을 초 단위로 반환
    public int getRefreshTokenMaxAgeSeconds() {
        return Math.toIntExact(Duration.ofDays(properties.refreshTokenExpirationDays()).toSeconds());
    }

    private String createToken(String email, TokenType tokenType, Duration expiration) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(expiration);

        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(email)
                .id(UUID.randomUUID().toString())
                .claim(TOKEN_TYPE_CLAIM, tokenType.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(secretKey)
                .compact();
    }
}
