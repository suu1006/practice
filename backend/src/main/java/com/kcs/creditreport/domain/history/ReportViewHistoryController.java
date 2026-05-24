package com.kcs.creditreport.domain.history;

import com.kcs.creditreport.domain.history.dto.ReportViewHistoryResponse;
import com.kcs.creditreport.global.dto.PageResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/histories")
@Validated
public class ReportViewHistoryController {

    private final ReportViewHistoryService historyService;

    public ReportViewHistoryController(ReportViewHistoryService historyService) {
        this.historyService = historyService;
    }

    /**
     * 조회이력 목록 조회
     */
    @GetMapping
    public ResponseEntity<PageResponse<ReportViewHistoryResponse>> getMyHistories(
            Principal principal,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(historyService.getMyHistories(principal.getName(), page, size));
    }
}
