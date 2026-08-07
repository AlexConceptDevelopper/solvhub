package com.solvhub.service;

import com.solvhub.dto.EquipmentDTO;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.EquipmentMapper;
import com.solvhub.model.Category;
import com.solvhub.model.Equipment;
import com.solvhub.repository.global.CategoryRepository;
import com.solvhub.repository.global.EquipmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final CategoryRepository categoryRepository;
    private final EquipmentMapper equipmentMapper;

    public EquipmentService(
            EquipmentRepository equipmentRepository,
            CategoryRepository categoryRepository,
            EquipmentMapper equipmentMapper) {
        this.equipmentRepository = equipmentRepository;
        this.categoryRepository = categoryRepository;
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
        String cleanBrand = brand != null ? brand.trim() : "";
        String cleanModel = model != null ? model.trim() : "";

        return equipmentRepository
                .findByCriteriaIgnoreCase(categoryId, cleanBrand, cleanModel)
                .map(equipmentMapper::toDTO)
                .orElse(null); 
    }

    public List<String> getBrandsByCategoryId(Integer categoryId) {
        return equipmentRepository.findDistinctBrandsByCategoryId(categoryId);
    }

    public List<String> getModelsByCategoryIdAndBrand(Integer categoryId, String brand) {
        return equipmentRepository.findModelsByCategoryIdAndBrand(categoryId, brand);
    }

    public EquipmentDTO createEquipment(Integer idCategory, String brand, String model) {
        String cleanBrand = brand != null ? brand.trim() : "";
        String cleanModel = model != null ? model.trim() : "";

        // 1. On vérifie si l'équipement existe déjà en base (insensible à la casse & trim)
        var existingEquipment = equipmentRepository.findByCriteriaIgnoreCase(idCategory, cleanBrand, cleanModel);

        if (existingEquipment.isPresent()) {
            return equipmentMapper.toDTO(existingEquipment.get());
        }

        // 2. S'il n'existe pas, on le crée proprement
        Category category = categoryRepository.findById(idCategory)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable avec l'id : " + idCategory));

        Equipment equipment = new Equipment();
        equipment.setCategory(category);
        equipment.setBrand(cleanBrand);
        equipment.setModel(cleanModel);

        Equipment savedEquipment = equipmentRepository.save(equipment);
        return equipmentMapper.toDTO(savedEquipment);
    }

    public EquipmentDTO updateEquipment(Integer id, Integer categoryId, String brand, String model) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement introuvable avec l'id : " + id));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable avec l'id : " + categoryId));

        equipment.setCategory(category);
        equipment.setBrand(brand != null ? brand.trim() : "");
        equipment.setModel(model != null ? model.trim() : "");

        Equipment updatedEquipment = equipmentRepository.save(equipment);
        return equipmentMapper.toDTO(updatedEquipment);
    }

    public void deleteEquipment(Integer id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Équipement introuvable avec l'id : " + id);
        }
        equipmentRepository.deleteById(id);
    }
}