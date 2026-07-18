package com.solvhub.controller.global;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solvhub.controller.GenericController;
import com.solvhub.dto.CategoryDTO;
import com.solvhub.mapper.CategoryMapper;
import com.solvhub.model.Category;
import com.solvhub.repository.global.CategoryRepository;
import com.solvhub.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController extends GenericController<Category, Integer> {

    private final CategoryMapper categoryMapper;
    private final CategoryService categoryService;

    public CategoryController(
            CategoryRepository categoryRepository,
            CategoryMapper categoryMapper,
            CategoryService categoryService) {
        super(categoryRepository);
        this.categoryMapper = categoryMapper;
        this.categoryService = categoryService;
    }

    @GetMapping("/all")
    public List<CategoryDTO> getCategories() {
        return categoryService
                .getAllCategories()
                .stream()
                .map(categoryMapper::toDTO)
                .toList();
    }

    @GetMapping("/with-count")
    public List<CategoryDTO> getCategoriesWithCount() {
        return categoryService.getAllCategoriesWithCount();
    }
}