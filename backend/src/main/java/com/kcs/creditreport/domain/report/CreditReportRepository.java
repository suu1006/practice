package com.kcs.creditreport.domain.report;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CreditReportRepository extends JpaRepository<CreditReport, Long>, JpaSpecificationExecutor<CreditReport> {

    Optional<CreditReport> findByIdAndUserEmail(Long id, String userEmail);
}
