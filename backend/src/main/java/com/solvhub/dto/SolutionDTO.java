package com.solvhub.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolutionDTO {

    private Integer idSolution;

    private String title;

    private String steps;

    private Integer difficulty;

    private Integer timeMinutes;

    private Integer riskLevel;

    private Instant createdAt;

    private Integer problemId;

    private UserDTO user;

    private Double score;

}
