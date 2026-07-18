package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.CategoryDTO;
import com.solvhub.model.Category;

@Component
public class CategoryMapper {

    public CategoryDTO toDTO(Category category) {

        if (category == null) {
            return null;
        }

        return new CategoryDTO(
            category.getIdCategory(),
            category.getName(),
            category.getIcon(),
            null
        );
    }
}
