package com.solvhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.solvhub.dto.CategoryDTO;
import com.solvhub.mapper.CategoryMapper;
import com.solvhub.model.Category;
import com.solvhub.repository.global.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<CategoryDTO> getAllCategoriesWithCount() {
        return categoryRepository.findAllWithProblemCount();
    }

    public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));

        category.setName(categoryDTO.getName());
        if (categoryDTO.getIcon() != null) {
            category.setIcon(categoryDTO.getIcon());
        }

        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(updatedCategory);
    }
}