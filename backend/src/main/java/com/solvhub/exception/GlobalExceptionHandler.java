package com.solvhub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiError> handleRuntimeException(
                        RuntimeException ex) {

                ApiError error = new ApiError(
                                Instant.now(),
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(error);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleException(
                        Exception ex) {

                ApiError error = new ApiError(
                                Instant.now(),
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Une erreur interne est survenue");

                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(error);
        }

        @ExceptionHandler(DuplicateVoteException.class)
        public ResponseEntity<ApiError> handleDuplicateVote(
                        DuplicateVoteException ex) {

                ApiError error = new ApiError(
                                Instant.now(),
                                HttpStatus.CONFLICT.value(),
                                ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(error);
        }

        // Gestion unifiée de toutes les violations SQL (Doublons = 409, Taille trop longue = 400)
        @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
        public ResponseEntity<ApiError> handleDataIntegrityViolation(
                        org.springframework.dao.DataIntegrityViolationException ex) {

                String message = "Une erreur est survenue lors de l'enregistrement des données.";
                HttpStatus status = HttpStatus.BAD_REQUEST;

                if (ex.getMessage() != null) {
                        if (ex.getMessage().contains("Unique index") || ex.getMessage().contains("duplicate key")) {
                                message = "Cette valeur existe déjà (doublon détecté).";
                                status = HttpStatus.CONFLICT; // 409
                        } else if (ex.getMessage().contains("character varying")) {
                                message = "L'un des champs saisis dépasse la taille maximale autorisée.";
                                status = HttpStatus.BAD_REQUEST; // 400
                        }
                }

                ApiError error = new ApiError(Instant.now(), status.value(), message);
                return ResponseEntity.status(status).body(error);
        }

        // Données invalides (400) via @Valid
        @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
        public ResponseEntity<ApiError> handleValidationExceptions(
                        org.springframework.web.bind.MethodArgumentNotValidException ex) {

                // Récupère le premier message d'erreur du champ en échec
                String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                                .map(error -> error.getField() + " : " + error.getDefaultMessage())
                                .findFirst()
                                .orElse("Données de validation invalides");

                ApiError error = new ApiError(Instant.now(), HttpStatus.BAD_REQUEST.value(), errorMessage);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiError> handleNotFound(
                        ResourceNotFoundException ex) {

                ApiError error = new ApiError(
                                Instant.now(),
                                HttpStatus.NOT_FOUND.value(),
                                ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(error);
        }

        @ExceptionHandler(InvalidDataException.class)
        public ResponseEntity<ApiError> handleInvalidData(
                        InvalidDataException ex) {

                ApiError error = new ApiError(
                                Instant.now(),
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(error);
        }

        @ExceptionHandler(ForbiddenException.class)
        public ResponseEntity<Map<String, String>> handleForbiddenException(ForbiddenException ex) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Accès refusé");
                error.put("message", ex.getMessage());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }
}