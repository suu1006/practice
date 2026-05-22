package com.kcs.creditreport.domain.report;

import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;

public final class CreditReportSpecifications {

    private CreditReportSpecifications() {
    }

    public static Specification<CreditReport> belongsTo(String email) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user").get("email"), email);
    }

    public static Specification<CreditReport> containsKeyword(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String likeKeyword = "%" + keyword.trim().toLowerCase() + "%";
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likeKeyword),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("agencyName")), likeKeyword)
            );
        };
    }

    public static Specification<CreditReport> creditGradeEquals(Integer creditGrade) {
        return (root, query, criteriaBuilder) -> creditGrade == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("creditGrade"), creditGrade);
    }

    public static Specification<CreditReport> issuedAtFrom(LocalDate from) {
        return (root, query, criteriaBuilder) -> from == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.greaterThanOrEqualTo(root.get("issuedAt"), from);
    }

    public static Specification<CreditReport> issuedAtTo(LocalDate to) {
        return (root, query, criteriaBuilder) -> to == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.lessThanOrEqualTo(root.get("issuedAt"), to);
    }
}
