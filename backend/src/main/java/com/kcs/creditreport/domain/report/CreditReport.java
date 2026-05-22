package com.kcs.creditreport.domain.report;

import com.kcs.creditreport.domain.auth.User;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "credit_reports")
public class CreditReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 80)
    private String agencyName;

    @Column(nullable = false)
    private int creditScore;

    @Column(nullable = false)
    private int creditGrade;

    @Column(nullable = false)
    private LocalDate issuedAt;

    @Convert(converter = ResidentRegistrationNumberConverter.class)
    @Column(nullable = false, length = 255)
    private String residentRegistrationNumber;

    @Column(nullable = false, length = 500)
    private String summary;

    private CreditReport(
            User user,
            String title,
            String agencyName,
            int creditScore,
            int creditGrade,
            LocalDate issuedAt,
            String residentRegistrationNumber,
            String summary) {
        this.user = user;
        this.title = title;
        this.agencyName = agencyName;
        this.creditScore = creditScore;
        this.creditGrade = creditGrade;
        this.issuedAt = issuedAt;
        this.residentRegistrationNumber = residentRegistrationNumber;
        this.summary = summary;
    }

    public static CreditReport create(
            User user,
            String title,
            String agencyName,
            int creditScore,
            int creditGrade,
            LocalDate issuedAt,
            String residentRegistrationNumber,
            String summary
    ) {
        return new CreditReport(user, title, agencyName, creditScore, creditGrade, issuedAt, residentRegistrationNumber,
                summary);
    }
}
