package com.kcs.creditreport.global.exception;

public record FieldErrorDetail(
        String field,
        String message
) {
}
