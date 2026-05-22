package com.kcs.creditreport.domain.history;

import com.kcs.creditreport.domain.history.dto.ReportViewHistoryResponse;
import com.kcs.creditreport.domain.report.CreditReport;
import com.kcs.creditreport.global.dto.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportViewHistoryService {

    private final ReportViewHistoryRepository historyRepository;

    public ReportViewHistoryService(ReportViewHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ReportViewHistoryResponse> getMyHistories(String email, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "viewedAt"));
        return PageResponse.from(historyRepository.findByUserEmail(email, pageRequest).map(this::toResponse));
    }

    private ReportViewHistoryResponse toResponse(ReportViewHistory history) {
        CreditReport report = history.getReport();
        return new ReportViewHistoryResponse(
                history.getId(),
                report.getId(),
                report.getTitle(),
                report.getAgencyName(),
                report.getCreditScore(),
                report.getCreditGrade(),
                history.getViewedAt()
        );
    }
}
