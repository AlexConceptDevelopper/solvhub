package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.ProblemDTO;
import com.solvhub.model.Problem;

@Component
public class ProblemMapper {

    private final UserMapper userMapper;

    public ProblemMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }


    public ProblemDTO toDTO(Problem problem) {

        if (problem == null) {
            return null;
        }

        return new ProblemDTO(
                problem.getIdProblem(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getCategory(),
                problem.getCreatedAt(),
                userMapper.toDTO(problem.getUser())
        );
    }
}