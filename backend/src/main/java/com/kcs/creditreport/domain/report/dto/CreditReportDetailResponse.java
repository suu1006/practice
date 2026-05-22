package com.kcs.creditreport.domain.report.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreditReportDetailResponse {

    private Long id;
    private String title;
    private String agencyName;
    private int creditScore;
    private int creditGrade;
    private LocalDate issuedAt;
    private String maskedResidentRegistrationNumber;
    private String summary;
}
