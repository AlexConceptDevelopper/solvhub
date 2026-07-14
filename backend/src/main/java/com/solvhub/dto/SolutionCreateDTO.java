package com.solvhub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolutionCreateDTO {

    private String title;

    private String steps;

    private Integer difficulty;

    private Integer timeMinutes;

    private Integer riskLevel;

    private Integer problemId;

}
