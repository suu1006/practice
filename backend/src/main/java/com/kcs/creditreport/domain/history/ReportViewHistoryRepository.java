package com.kcs.creditreport.domain.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportViewHistoryRepository extends JpaRepository<ReportViewHistory, Long> {

    Page<ReportViewHistory> findByUserEmail(String userEmail, Pageable pageable);
}
