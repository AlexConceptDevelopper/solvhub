package com.solvhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.mapper.SolutionMapper;
import com.solvhub.repository.global.SolutionRepository;

@Service
public class RankingService {

    private final SolutionRepository repo;
    private final SolutionMapper mapper;


    public RankingService(
            SolutionRepository repo,
            SolutionMapper mapper
    ) {
        this.repo = repo;
        this.mapper = mapper;
    }


    public List<SolutionDTO> getBestSolutions() {

        return repo.findBestSolutions()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}
