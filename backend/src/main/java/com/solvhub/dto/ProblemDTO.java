package com.solvhub.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDTO {

    private Integer idProblem;

    private String title;

    private String description;

    private CategoryDTO category;

    private Instant createdAt;

    private UserDTO user;

}
