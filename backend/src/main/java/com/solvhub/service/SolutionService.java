package com.solvhub.service;

import com.solvhub.dto.SolutionCreateDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.SolutionMapper;
import com.solvhub.model.Problem;
import com.solvhub.model.Solution;
import com.solvhub.model.SolutionStats;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.repository.global.SolutionStatsRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolutionService {

    private final SolutionRepository repo;
    private final SolutionMapper mapper;
    private final ProblemRepository problemRepository;
    private final SolutionStatsRepository solutionStatsRepository;

    public SolutionService(
            SolutionRepository repo,
            SolutionMapper mapper,
            ProblemRepository problemRepository,
            SolutionStatsRepository solutionStatsRepository) {

        this.repo = repo;
        this.mapper = mapper;
        this.problemRepository = problemRepository;
        this.solutionStatsRepository = solutionStatsRepository;
    }

    public List<Solution> findAll() {
        return repo.findAll();
    }

    public Solution save(Solution solution) {
        return repo.save(solution);
    }

    public List<SolutionDTO> findAllDTO() {

        return repo.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public SolutionDTO findByIdDTO(Integer id) {

        Solution solution = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Solution introuvable"));

        return mapper.toDTO(solution);
    }

    @Transactional
    public SolutionDTO createSolution(SolutionCreateDTO dto) {

        Problem problem = problemRepository.findById(dto.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problème introuvable"));

        Solution solution = new Solution();

        solution.setTitle(dto.getTitle());
        solution.setSteps(dto.getSteps());
        solution.setDifficulty(dto.getDifficulty());
        solution.setTimeMinutes(dto.getTimeMinutes());
        solution.setRiskLevel(dto.getRiskLevel());
        solution.setProblem(problem);

        Solution saved = repo.save(solution);

        SolutionStats stats = new SolutionStats();
        stats.setSolution(saved);

        solutionStatsRepository.save(stats);

        return mapper.toDTO(saved);
    }
}