package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.SolutionStatsDTO;
import com.solvhub.model.SolutionStats;

@Component
public class SolutionStatsMapper {


    public SolutionStatsDTO toDTO(SolutionStats stats) {

        if (stats == null) {
            return null;
        }

        Integer solutionId = null;

        if (stats.getSolution() != null) {
            solutionId = stats.getSolution().getIdSolution();
        }


        return new SolutionStatsDTO(
                stats.getIdSolutionStats(),
                stats.getSuccessCount(),
                stats.getPartialCount(),
                stats.getFailureCount(),
                stats.getLastUpdated(),
                solutionId
        );
    }
}
