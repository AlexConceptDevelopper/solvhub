package com.solvhub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {

    private Integer idCategory;
    private String name;
    private String icon;
    private Long problemCount;
}
