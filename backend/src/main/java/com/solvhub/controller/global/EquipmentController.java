package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.EquipmentDTO;
import com.solvhub.repository.global.EquipmentRepository;
import com.solvhub.service.EquipmentService;

@RestController
@RequestMapping("/api/equipments")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(
            EquipmentRepository equipmentRepository,
            EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentDTO>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.getAllEquipments());
    }

    @PostMapping
    public ResponseEntity<EquipmentDTO> createEquipment(@RequestBody EquipmentDTO dto) {
        // Extraction cohérente via getIdCategory()
        Integer idCategory = dto.getCategory() != null ? dto.getCategory().getIdCategory() : null;

        EquipmentDTO created = equipmentService.createEquipment(idCategory, dto.getBrand(), dto.getModel());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{idEquipment}")
    public ResponseEntity<EquipmentDTO> updateEquipment(@PathVariable("idEquipment") Integer idEquipment,
            @RequestBody EquipmentDTO dto) {
        Integer idCategory = dto.getCategory() != null ? dto.getCategory().getIdCategory() : null;

        EquipmentDTO updated = equipmentService.updateEquipment(idEquipment, idCategory, dto.getBrand(),
                dto.getModel());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{idEquipment}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Integer idEquipment) {
        equipmentService.deleteEquipment(idEquipment); // Appel effectif de la suppression dans le service
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrandsByCategory(@RequestParam("categoryId") Integer categoryId) {
        List<String> brands = equipmentService.getBrandsByCategoryId(categoryId);
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/models")
    public ResponseEntity<List<String>> getModelsByCategoryAndBrand(
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("brand") String brand) {
        List<String> models = equipmentService.getModelsByCategoryIdAndBrand(categoryId, brand);
        return ResponseEntity.ok(models);
    }

    @GetMapping("/find")
    public EquipmentDTO findEquipment(
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("brand") String brand,
            @RequestParam("model") String model) {
        return equipmentService.findByCategoryAndBrandAndModel(categoryId, brand, model);
    }
}