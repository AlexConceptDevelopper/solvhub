package com.solvhub.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class ApiError {

    private Instant timestamp;

    private int status;

    private String message;
}
