package com.solvhub.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoteDTO {

    private Integer idVotes;

    private String status;

    private String comment;

    private Instant createdAt;

    private Integer userId;

    private Integer solutionId;

}