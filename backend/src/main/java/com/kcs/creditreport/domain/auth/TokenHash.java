package com.kcs.creditreport.domain.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public final class TokenHash {

    private TokenHash() {
    }

    public static String sha256(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256"); // SHA-256 해시 알고리즘 사용
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8)); // 토큰을 UTF-8로 인코딩하여 해시 생성
            return HexFormat.of().formatHex(hash); // 해시를 16진수 문자열로 변환
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 알고리즘을 사용할 수 없습니다.", exception);
        }
    }
}
