package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.ProblemDTO;
import com.solvhub.model.Problem;

@Component
public class ProblemMapper {

    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;

    public ProblemMapper(UserMapper userMapper, CategoryMapper categoryMapper) {
        this.userMapper = userMapper;
        this.categoryMapper = categoryMapper;
    }


    public ProblemDTO toDTO(Problem problem) {

        if (problem == null) {
            return null;
        }

        return new ProblemDTO(
                problem.getIdProblem(),
                problem.getTitle(),
                problem.getDescription(),
                categoryMapper.toDTO(problem.getCategory()),
                problem.getCreatedAt(),
                userMapper.toDTO(problem.getUser())
        );
    }
}