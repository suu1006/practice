package com.kcs.creditreport.domain.history.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReportViewHistoryResponse {

    private Long id;
    private Long reportId;
    private String reportTitle;
    private String agencyName;
    private int creditScore;
    private int creditGrade;
    private LocalDateTime viewedAt;
}
