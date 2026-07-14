package com.solvhub.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolutionStatsDTO {

    private Integer idSolutionStats;

    private Integer successCount;

    private Integer partialCount;

    private Integer failureCount;

    private Instant lastUpdated;

    private Integer solutionId;

}
