package com.solvhub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDTO {
    private Integer idEquipment;
    private CategoryDTO category;
    private String brand;
    private String model;
    private Integer year;
}