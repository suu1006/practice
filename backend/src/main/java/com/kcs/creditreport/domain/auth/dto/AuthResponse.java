package com.kcs.creditreport.domain.auth.dto;

public record AuthResponse(
        String accessToken,
        UserResponse user
) {
}
