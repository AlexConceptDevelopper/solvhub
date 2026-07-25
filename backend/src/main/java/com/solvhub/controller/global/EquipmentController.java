package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solvhub.controller.GenericController;
import com.solvhub.dto.EquipmentDTO;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.model.Equipment;
import com.solvhub.repository.global.EquipmentRepository;
import com.solvhub.service.EquipmentService;

@RestController
@RequestMapping("/api/equipments")
public class EquipmentController extends GenericController<Equipment, Integer> {

    private final EquipmentService equipmentService;

    public EquipmentController(
            EquipmentRepository equipmentRepository,
            EquipmentService equipmentService) {
        super(equipmentRepository);
        this.equipmentService = equipmentService;
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrandsByCategory(@RequestParam Integer categoryId) {
        // Appel propre via le service
        List<String> brands = equipmentService.getBrandsByCategoryId(categoryId);
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/models")
    public ResponseEntity<List<String>> getModelsByCategoryAndBrand(
            @RequestParam Integer categoryId,
            @RequestParam String brand) {
        // Appel propre via le service
        List<String> models = equipmentService.getModelsByCategoryIdAndBrand(categoryId, brand);
        return ResponseEntity.ok(models);
    }

    @GetMapping("/find")
    public EquipmentDTO findEquipment(
            @RequestParam Integer categoryId,
            @RequestParam String brand,
            @RequestParam String model) {
        return equipmentService.findByCategoryAndBrandAndModel(categoryId, brand, model);
    }
}