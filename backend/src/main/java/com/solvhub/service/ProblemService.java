package com.solvhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.solvhub.dto.ProblemDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.ProblemMapper;
import com.solvhub.mapper.SolutionMapper;
import com.solvhub.model.Problem;
import com.solvhub.model.Solution;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.repository.global.SolutionRepository;

@Service
public class ProblemService {

    private final SolutionRepository solutionRepository;
    private final SolutionMapper solutionMapper;
    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;

    public ProblemService(
            SolutionRepository solutionRepository,
            SolutionMapper solutionMapper,
            ProblemRepository problemRepository,
            ProblemMapper problemMapper) {
        this.solutionRepository = solutionRepository;
        this.solutionMapper = solutionMapper;
        this.problemRepository = problemRepository;
        this.problemMapper = problemMapper;
    }

    public List<ProblemDTO> findAllDTO() {

        return problemRepository.findAll()
                .stream()
                .map(problemMapper::toDTO)
                .toList();
    }

    public List<SolutionDTO> getSolutionsByProblem(Integer idProblem) {

        List<Solution> solutions = solutionRepository.findByProblemIdProblem(idProblem);

        return solutions.stream()
                .map(solutionMapper::toDTO)
                .toList();
    }

    public ProblemDTO findByIdDTO(Integer id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Problème introuvable"));

        return problemMapper.toDTO(problem);
    }
}