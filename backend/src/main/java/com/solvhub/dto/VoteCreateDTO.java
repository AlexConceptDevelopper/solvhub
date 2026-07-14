package com.solvhub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoteCreateDTO {

    private String status;

    private String comment;

    private Integer userId;

    private Integer solutionId;
}
