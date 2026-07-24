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

        ProblemDTO dto = new ProblemDTO();
        dto.setIdProblem(problem.getIdProblem());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setCategory(categoryMapper.toDTO(problem.getCategory()));
        dto.setCreatedAt(problem.getCreatedAt());
        dto.setUser(userMapper.toDTO(problem.getUser()));

        return dto;
    }
}