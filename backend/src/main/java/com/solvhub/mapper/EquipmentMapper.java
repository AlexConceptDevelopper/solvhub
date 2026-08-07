package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.EquipmentDTO;
import com.solvhub.model.Equipment;

@Component
public class EquipmentMapper {

    private final CategoryMapper categoryMapper;

    public EquipmentMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public EquipmentDTO toDTO(Equipment equipment) {
        if (equipment == null) {
            return null;
        }

        EquipmentDTO dto = new EquipmentDTO();
        dto.setIdEquipment(equipment.getIdEquipment());
        dto.setCategory(categoryMapper.toDTO(equipment.getCategory()));
        dto.setBrand(equipment.getBrand());
        dto.setModel(equipment.getModel());
        dto.setYear(equipment.getYear());

        return dto;
    }

    public Equipment toEntity(EquipmentDTO dto) {
        if (dto == null) {
            return null;
        }

        Equipment equipment = new Equipment();
        equipment.setIdEquipment(dto.getIdEquipment());
        equipment.setCategory(categoryMapper.toEntity(dto.getCategory()));
        equipment.setBrand(dto.getBrand());
        equipment.setModel(dto.getModel());
        equipment.setYear(dto.getYear());
        
        return equipment;
    }
}