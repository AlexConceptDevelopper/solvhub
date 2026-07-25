package com.solvhub.service;

import com.solvhub.dto.EquipmentDTO;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.EquipmentMapper;
import com.solvhub.model.Equipment;
import com.solvhub.repository.global.EquipmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    public EquipmentService(EquipmentRepository equipmentRepository, EquipmentMapper equipmentMapper) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentMapper = equipmentMapper;
    }

    public List<EquipmentDTO> getAllEquipments() {
        return equipmentRepository.findAll()
                .stream()
                .map(equipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<EquipmentDTO> getByCategory(String category) {
        return equipmentRepository.findByCategory(category)
                .stream()
                .map(equipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public EquipmentDTO findByCategoryAndBrandAndModel(Integer categoryId, String brand, String model) {
        Equipment equipment = equipmentRepository
                .findByCategory_IdCategoryAndBrandAndModel(categoryId, brand, model)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement introuvable"));
        return equipmentMapper.toDTO(equipment);
    }

    // Ajout des méthodes métiers ici :
    public List<String> getBrandsByCategoryId(Integer categoryId) {
        return equipmentRepository.findDistinctBrandsByCategoryId(categoryId);
    }

    public List<String> getModelsByCategoryIdAndBrand(Integer categoryId, String brand) {
        return equipmentRepository.findModelsByCategoryIdAndBrand(categoryId, brand);
    }
}