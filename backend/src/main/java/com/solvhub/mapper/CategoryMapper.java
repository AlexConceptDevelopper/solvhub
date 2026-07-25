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
                null);
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }
        Category category = new Category();
        category.setIdCategory(dto.getIdCategory());
        category.setName(dto.getName());
        category.setIcon(dto.getIcon());
        return category;
    }
}
