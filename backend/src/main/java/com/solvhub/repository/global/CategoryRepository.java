package com.solvhub.repository.global;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.solvhub.dto.CategoryDTO;
import com.solvhub.model.Category;
import com.solvhub.repository.GenericRepository;

public interface CategoryRepository extends GenericRepository<Category, Integer> {
    @Query("""
        SELECT new com.solvhub.dto.CategoryDTO(
            c.idCategory, c.name, c.icon, COUNT(p)
        )
        FROM Category c
        LEFT JOIN c.problems p
        GROUP BY c.idCategory, c.name, c.icon
    """)
    List<CategoryDTO> findAllWithProblemCount();
}