package com.solvhub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.solvhub.dto.CategoryDTO;
import com.solvhub.model.Category;
import com.solvhub.repository.global.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<CategoryDTO> getAllCategoriesWithCount() {
        return categoryRepository.findAllWithProblemCount();
    }
}