package com.kcs.creditreport.global.exception;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String message;
    private List<FieldErrorDetail> errors;

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(LocalDateTime.now(), status, message, List.of());
    }

    public static ErrorResponse of(int status, String message, List<FieldErrorDetail> errors) {
        return new ErrorResponse(LocalDateTime.now(), status, message, errors);
    }
}
