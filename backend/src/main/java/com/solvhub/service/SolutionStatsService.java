package com.solvhub.service;

import com.solvhub.dto.SolutionStatsDTO;
import com.solvhub.mapper.SolutionStatsMapper;
import com.solvhub.model.SolutionStats;
import com.solvhub.repository.global.SolutionStatsRepository;

import jakarta.transaction.Transactional;

import java.time.Instant;

import org.springframework.stereotype.Service;

@Service
public class SolutionStatsService {

    private final SolutionStatsRepository repo;
    private final SolutionStatsMapper mapper;

    public SolutionStatsService(SolutionStatsRepository repo, SolutionStatsMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
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

    @Transactional
    public SolutionStatsDTO getStatsDTO(Integer solutionId) {
        SolutionStats stats = repo.findBySolutionIdSolution(solutionId);
        if (stats == null) {
            return new SolutionStatsDTO(
                    null,
                    0,
                    0,
                    0,
                    Instant.now(),
                    solutionId);
        }

        return mapper.toDTO(stats);
    }
}