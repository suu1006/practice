package com.kcs.creditreport.domain.history;

import com.kcs.creditreport.domain.auth.User;
import com.kcs.creditreport.domain.report.CreditReport;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "report_view_histories")
public class ReportViewHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private CreditReport report;

    @Column(nullable = false)
    private LocalDateTime viewedAt;

    private ReportViewHistory(User user, CreditReport report) {
        this.user = user;
        this.report = report;
        this.viewedAt = LocalDateTime.now();
    }

    public static ReportViewHistory record(User user, CreditReport report) {
        return new ReportViewHistory(user, report);
    }
}
