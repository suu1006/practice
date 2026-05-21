package com.kcs.creditreport.domain.auth;

import com.kcs.creditreport.domain.auth.dto.AuthResponse;
import com.kcs.creditreport.domain.auth.dto.LoginRequest;
import com.kcs.creditreport.domain.auth.dto.MessageResponse;
import com.kcs.creditreport.domain.auth.dto.SignupRequest;
import com.kcs.creditreport.global.exception.BusinessException;
import com.kcs.creditreport.global.security.JwtProvider;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    private final AuthService authService;
    private final JwtProvider jwtProvider;

    public AuthController(AuthService authService, JwtProvider jwtProvider) {
        this.authService = authService;
        this.jwtProvider = jwtProvider;
    }

    // 회원가입 + 토큰 발급
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request,
            HttpServletResponse response) {
        AuthTokens tokens = authService.signup(request);
        addRefreshTokenCookie(response, tokens.refreshToken());
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.toResponse(tokens));
    }

    // 로그인 + 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthTokens tokens = authService.login(request);
        addRefreshTokenCookie(response, tokens.refreshToken());
        return ResponseEntity.ok(authService.toResponse(tokens));
    }

    // 리프레시 토큰 갱신 + 토큰 발급
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(value = REFRESH_TOKEN_COOKIE, required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "Refresh Token이 없습니다.");
        }

        AuthTokens tokens = authService.refresh(refreshToken);
        addRefreshTokenCookie(response, tokens.refreshToken());
        return ResponseEntity.ok(authService.toResponse(tokens));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(Principal principal, HttpServletResponse response) {
        if (principal == null) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "인증이 필요합니다.");
        }

        authService.logout(principal.getName());
        expireRefreshTokenCookie(response);
        return ResponseEntity.ok(new MessageResponse("로그아웃되었습니다."));
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax") // 다른 사이트 임의요청에는 거부
                .path("/api")
                .maxAge(jwtProvider.getRefreshTokenMaxAgeSeconds())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void expireRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
