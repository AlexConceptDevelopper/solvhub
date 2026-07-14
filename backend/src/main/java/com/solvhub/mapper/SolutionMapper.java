package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.model.Solution;

@Component
public class SolutionMapper {

    private final UserMapper userMapper;


    public SolutionMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }


    public SolutionDTO toDTO(Solution solution) {

        if (solution == null) {
            return null;
        }


        Double score = null;

        if (solution.getSolutionStats() != null) {
            score = solution.getSolutionStats().getScore();
        }


        return new SolutionDTO(
                solution.getIdSolution(),
                solution.getTitle(),
                solution.getSteps(),
                solution.getDifficulty(),
                solution.getTimeMinutes(),
                solution.getRiskLevel(),
                solution.getCreatedAt(),
                solution.getProblem().getIdProblem(),
                userMapper.toDTO(solution.getUser()),
                score
        );
    }
}
