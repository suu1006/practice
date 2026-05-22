package com.kcs.creditreport.global.config;

import com.kcs.creditreport.domain.auth.User;
import com.kcs.creditreport.domain.auth.UserRepository;
import com.kcs.creditreport.domain.report.CreditReport;
import com.kcs.creditreport.domain.report.CreditReportRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "Password1!";

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            CreditReportRepository reportRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.existsByEmail(TEST_EMAIL)) {
                return;
            }

            User user = User.create(TEST_EMAIL, passwordEncoder.encode(TEST_PASSWORD));
            userRepository.save(user);

            List<CreditReport> reports = List.of(
                    report(user, "2026 상반기 개인 신용평가", "KCS 평가정보", 842, 2, LocalDate.of(2026, 5, 18), "900101-1234567"),
                    report(user, "카드 이용 기반 신용 리포트", "KCS 평가정보", 773, 4, LocalDate.of(2026, 4, 29), "900101-1234567"),
                    report(user, "대출 상환 패턴 분석 리포트", "서울신용데이터", 812, 3, LocalDate.of(2026, 4, 12), "900101-1234567"),
                    report(user, "장기 거래 신용평가", "한국평가정보", 865, 2, LocalDate.of(2026, 3, 21), "900101-1234567"),
                    report(user, "금융 이력 종합 진단", "KCS 평가정보", 718, 5, LocalDate.of(2026, 3, 2), "900101-1234567"),
                    report(user, "소득 안정성 기반 신용 리포트", "서울신용데이터", 791, 4, LocalDate.of(2026, 2, 16), "900101-1234567"),
                    report(user, "연체 위험도 분석 리포트", "한국평가정보", 684, 6, LocalDate.of(2026, 2, 1), "900101-1234567"),
                    report(user, "카드 한도 적정성 평가", "KCS 평가정보", 826, 3, LocalDate.of(2026, 1, 19), "900101-1234567"),
                    report(user, "금융기관 제출용 신용평가", "서울신용데이터", 901, 1, LocalDate.of(2025, 12, 22), "900101-1234567"),
                    report(user, "월별 신용점수 변동 리포트", "KCS 평가정보", 756, 4, LocalDate.of(2025, 12, 3), "900101-1234567"),
                    report(user, "비금융 데이터 기반 평가", "한국평가정보", 739, 5, LocalDate.of(2025, 11, 14), "900101-1234567"),
                    report(user, "신규 대출 가능성 리포트", "서울신용데이터", 702, 5, LocalDate.of(2025, 10, 28), "900101-1234567"),
                    report(user, "신용카드 상환 안정성 평가", "KCS 평가정보", 874, 2, LocalDate.of(2025, 10, 11), "900101-1234567"),
                    report(user, "개인 금융 습관 진단", "한국평가정보", 663, 7, LocalDate.of(2025, 9, 20), "900101-1234567"),
                    report(user, "분기별 신용평가 요약", "KCS 평가정보", 805, 3, LocalDate.of(2025, 9, 1), "900101-1234567")
            );
            reportRepository.saveAll(reports);
        };
    }

    private CreditReport report(
            User user,
            String title,
            String agencyName,
            int creditScore,
            int creditGrade,
            LocalDate issuedAt,
            String residentRegistrationNumber
    ) {
        return CreditReport.create(
                user,
                title,
                agencyName,
                creditScore,
                creditGrade,
                issuedAt,
                residentRegistrationNumber,
                "최근 금융 거래 이력, 상환 패턴, 카드 이용 안정성을 기반으로 산출된 샘플 신용평가 리포트입니다."
        );
    }
}
