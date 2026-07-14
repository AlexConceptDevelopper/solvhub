package com.solvhub.service;

import com.solvhub.model.SolutionStats;
import com.solvhub.repository.global.SolutionStatsRepository;
import org.springframework.stereotype.Service;

@Service
public class SolutionStatsService {

    private final SolutionStatsRepository repo;

    public SolutionStatsService(SolutionStatsRepository repo) {
        this.repo = repo;
    }

    public SolutionStats save(SolutionStats stats) {
        return repo.save(stats);
    }

    public void registerSuccess(SolutionStats stats) {
        stats.setSuccessCount(stats.getSuccessCount() + 1);
        repo.save(stats);
    }

    public void registerPartial(SolutionStats stats) {
        stats.setPartialCount(stats.getPartialCount() + 1);
        repo.save(stats);
    }

    public void registerFailure(SolutionStats stats) {
        stats.setFailureCount(stats.getFailureCount() + 1);
        repo.save(stats);
    }
}