package com.kcs.creditreport.domain.auth;

import com.kcs.creditreport.domain.auth.dto.AuthResponse;
import com.kcs.creditreport.domain.auth.dto.LoginRequest;
import com.kcs.creditreport.domain.auth.dto.SignupRequest;
import com.kcs.creditreport.domain.auth.dto.UserResponse;
import com.kcs.creditreport.global.exception.BusinessException;
import com.kcs.creditreport.global.security.JwtProvider;
import com.kcs.creditreport.global.security.TokenType;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Transactional
    public AuthTokens signup(SignupRequest request) {
        // 1. 이메일 중복 체크
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(HttpStatus.CONFLICT, "이미 가입한 계정입니다.");
        }

        // 2. 사용자 생성
        User user = User.create(email, passwordEncoder.encode(request.getPassword()));
        // 3. 사용자 저장
        userRepository.save(user);
        // 4. 토큰 발급
        return issueTokens(user);
    }

    @Transactional
    public AuthTokens login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthTokens refresh(String refreshToken) {
        String email = jwtProvider.getSubject(refreshToken, TokenType.REFRESH);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "유효하지 않은 Refresh Token입니다."));

        String refreshTokenHash = TokenHash.sha256(refreshToken);
        if (user.getRefreshTokenHash() == null || !user.getRefreshTokenHash().equals(refreshTokenHash)) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "유효하지 않은 Refresh Token입니다.");
        }

        return issueTokens(user);
    }

    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "인증 사용자를 찾을 수 없습니다."));
        user.clearRefreshToken();
    }

    public AuthResponse toResponse(AuthTokens tokens) {
        User user = tokens.user();
        return new AuthResponse(tokens.accessToken(), new UserResponse(user.getId(), user.getEmail()));
    }

    private AuthTokens issueTokens(User user) {
        String accessToken = jwtProvider.createAccessToken(user.getEmail());
        String refreshToken = jwtProvider.createRefreshToken(user.getEmail());
        
        user.updateRefreshTokenHash(TokenHash.sha256(refreshToken));
        return new AuthTokens(accessToken, refreshToken, user);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
