package com.kcs.creditreport.domain.report;

import static com.kcs.creditreport.domain.report.CreditReportSpecifications.belongsTo;
import static com.kcs.creditreport.domain.report.CreditReportSpecifications.containsKeyword;
import static com.kcs.creditreport.domain.report.CreditReportSpecifications.creditGradeEquals;
import static com.kcs.creditreport.domain.report.CreditReportSpecifications.issuedAtFrom;
import static com.kcs.creditreport.domain.report.CreditReportSpecifications.issuedAtTo;

import com.kcs.creditreport.domain.auth.User;
import com.kcs.creditreport.domain.auth.UserRepository;
import com.kcs.creditreport.domain.history.ReportViewHistory;
import com.kcs.creditreport.domain.history.ReportViewHistoryRepository;
import com.kcs.creditreport.domain.report.dto.CreditReportDetailResponse;
import com.kcs.creditreport.domain.report.dto.CreditReportSearchCondition;
import com.kcs.creditreport.domain.report.dto.CreditReportSummaryResponse;
import com.kcs.creditreport.global.dto.PageResponse;
import com.kcs.creditreport.global.exception.BusinessException;
import java.util.Set;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreditReportService {

    private static final Set<String> ALLOWED_SORT_PROPERTIES = Set.of("issuedAt", "creditScore");

    private final CreditReportRepository reportRepository;
    private final ReportViewHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public CreditReportService(
            CreditReportRepository reportRepository,
            ReportViewHistoryRepository historyRepository,
            UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<CreditReportSummaryResponse> getMyReports(
            String email,
            CreditReportSearchCondition condition,
            int page,
            int size) {
        validateSearchCondition(condition);

        // 동적 쿼리 조건 (email(필수), keyword(선택), creditGrade(선택), from(선택), to(선택))
        Specification<CreditReport> specification = belongsTo(email)
                .and(containsKeyword(condition.getKeyword()))
                .and(creditGradeEquals(condition.getCreditGrade()))
                .and(issuedAtFrom(condition.getFrom()))
                .and(issuedAtTo(condition.getTo()));

        PageRequest pageRequest = PageRequest.of(page, size, toSort(condition));
        return PageResponse.from(reportRepository.findAll(specification, pageRequest).map(this::toSummaryResponse));
    }

    @Transactional
    public CreditReportDetailResponse getMyReportDetail(String email, Long reportId) {
        CreditReport report = reportRepository.findByIdAndUserEmail(reportId, email)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "리포트를 찾을 수 없습니다."));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "인증 사용자를 찾을 수 없습니다."));

        historyRepository.save(ReportViewHistory.record(user, report));
        return toDetailResponse(report);
    }

    /**
     * 검색 조건 유효성 검사
     */
    private void validateSearchCondition(CreditReportSearchCondition condition) {
        if (condition.getCreditGrade() != null && (condition.getCreditGrade() < 1 || condition.getCreditGrade() > 10)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "신용등급은 1~10 사이여야 합니다.");
        }

        if (condition.getFrom() != null && condition.getTo() != null && condition.getFrom().isAfter(condition.getTo())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "발급일 시작일은 종료일보다 늦을 수 없습니다.");
        }

        String sortBy = resolveSortBy(condition.getSortBy());
        if (!ALLOWED_SORT_PROPERTIES.contains(sortBy)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "정렬 기준은 issuedAt 또는 creditScore만 사용할 수 있습니다.");
        }
    }

    /**
     * 정렬 조건 변환
     */
    private Sort toSort(CreditReportSearchCondition condition) {
        Sort.Direction direction = "asc".equalsIgnoreCase(condition.getDirection())
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        return Sort.by(direction, resolveSortBy(condition.getSortBy()));
    }

    /**
     * 정렬 조건 해석
     */
    private String resolveSortBy(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "issuedAt";
        }
        return sortBy;
    }

    /**
     * 요약 응답 변환
     */
    private CreditReportSummaryResponse toSummaryResponse(CreditReport report) {
        return new CreditReportSummaryResponse(
                report.getId(),
                report.getTitle(),
                report.getAgencyName(),
                report.getCreditScore(),
                report.getCreditGrade(),
                report.getIssuedAt());
    }

    /**
     * 상세 응답 변환
     */
    private CreditReportDetailResponse toDetailResponse(CreditReport report) {
        return new CreditReportDetailResponse(
                report.getId(),
                report.getTitle(),
                report.getAgencyName(),
                report.getCreditScore(),
                report.getCreditGrade(),
                report.getIssuedAt(),
                maskResidentRegistrationNumber(report.getResidentRegistrationNumber()),
                report.getSummary());
    }

    /**
     * 주민등록번호 마스킹
     */
    private String maskResidentRegistrationNumber(String value) {
        if (value == null || value.length() < 8) {
            return "";
        }
        return value.substring(0, 8) + "******";
    }
}
