package com.solvhub.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemCheckRequestDTO {
    private String title;
    private String description;
    private Integer categoryId;
    private Integer equipmentId;
}
