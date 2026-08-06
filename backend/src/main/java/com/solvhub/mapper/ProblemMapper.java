package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.ProblemDTO;
import com.solvhub.model.Problem;
import com.solvhub.repository.global.EquipmentRepository;

@Component
public class ProblemMapper {

    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;
    private final EquipmentMapper equipmentMapper;
    private final EquipmentRepository equipmentRepository;

    public ProblemMapper(
            UserMapper userMapper, 
            CategoryMapper categoryMapper, 
            EquipmentMapper equipmentMapper,
            EquipmentRepository equipmentRepository) {
        this.userMapper = userMapper;
        this.categoryMapper = categoryMapper;
        this.equipmentMapper = equipmentMapper;
        this.equipmentRepository = equipmentRepository;
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
        dto.setNbSolutions(problem.getSolutions() != null ? problem.getSolutions().size() : 0); 
        
        // Mapper l'équipement si présent
        if (problem.getEquipment() != null) {
            dto.setEquipment(equipmentMapper.toDTO(problem.getEquipment()));
        }

        return dto;
    }

    public Problem toEntity(ProblemDTO dto) {
        if (dto == null) {
            return null;
        }

        Problem problem = new Problem();
        problem.setIdProblem(dto.getIdProblem());
        problem.setTitle(dto.getTitle());
        problem.setDescription(dto.getDescription());
        
        if (dto.getCategory() != null) {
            problem.setCategory(categoryMapper.toEntity(dto.getCategory()));
        }

        // Lier l'équipement s'il est présent dans le DTO
        if (dto.getEquipment() != null && dto.getEquipment().getIdEquipment() != null) {
            equipmentRepository.findById(dto.getEquipment().getIdEquipment())
                    .ifPresent(problem::setEquipment);
        }

        return problem;
    }
}