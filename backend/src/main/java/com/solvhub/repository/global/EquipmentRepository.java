package com.solvhub.repository.global;

import com.solvhub.model.Equipment;
import com.solvhub.repository.GenericRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EquipmentRepository extends GenericRepository<Equipment, Integer> {
    List<Equipment> findByCategory(String category);

    List<Equipment> findByBrandIgnoreCase(String brand);

    @Query("SELECT DISTINCT e.brand FROM Equipment e WHERE e.category.idCategory = :categoryId ORDER BY e.brand")
    List<String> findDistinctBrandsByCategoryId(@Param("categoryId") Integer categoryId);

    @Query("SELECT e.model FROM Equipment e WHERE e.category.idCategory = :categoryId AND e.brand = :brand ORDER BY e.model")
    List<String> findModelsByCategoryIdAndBrand(@Param("categoryId") Integer categoryId, @Param("brand") String brand);

    @Query("SELECT e FROM Equipment e WHERE e.category.idCategory = :categoryId AND LOWER(TRIM(e.brand)) = LOWER(TRIM(:brand)) AND LOWER(TRIM(e.model)) = LOWER(TRIM(:model))")
    Optional<Equipment> findByCriteriaIgnoreCase(
        @Param("categoryId") Integer categoryId, 
        @Param("brand") String brand, 
        @Param("model") String model
    );
}
