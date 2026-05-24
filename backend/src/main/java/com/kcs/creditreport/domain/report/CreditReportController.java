package com.kcs.creditreport.domain.report;

import com.kcs.creditreport.domain.report.dto.CreditReportDetailResponse;
import com.kcs.creditreport.domain.report.dto.CreditReportSearchCondition;
import com.kcs.creditreport.domain.report.dto.CreditReportSummaryResponse;
import com.kcs.creditreport.global.dto.PageResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
@Validated
public class CreditReportController {

    private final CreditReportService reportService;

    public CreditReportController(CreditReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * 리포트 목록 조회
     */
    @GetMapping
    public ResponseEntity<PageResponse<CreditReportSummaryResponse>> getMyReports(
            Principal principal,
            @ModelAttribute CreditReportSearchCondition condition,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(reportService.getMyReports(principal.getName(), condition, page, size));
    }

    /**
     * 리포트 상세 조회
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<CreditReportDetailResponse> getMyReportDetail(
            Principal principal,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(reportService.getMyReportDetail(principal.getName(), reportId));
    }
}
