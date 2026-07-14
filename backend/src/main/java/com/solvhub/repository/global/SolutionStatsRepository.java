package com.solvhub.repository.global;

import com.solvhub.model.SolutionStats;
import com.solvhub.repository.GenericRepository;

public interface SolutionStatsRepository extends GenericRepository<SolutionStats, Integer> {
    SolutionStats findBySolutionIdSolution(Integer idSolution);
}
