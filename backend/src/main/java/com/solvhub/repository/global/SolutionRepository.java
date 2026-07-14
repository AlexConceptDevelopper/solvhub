package com.solvhub.repository.global;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.solvhub.model.Solution;
import com.solvhub.repository.GenericRepository;

public interface SolutionRepository extends GenericRepository<Solution, Integer> {

    List<Solution> findByProblemIdProblem(Integer idProblem);

    @Query("""
        SELECT s
        FROM Solution s
        JOIN s.solutionStats st
        ORDER BY 
        (st.successCount * 1.0 + st.partialCount * 0.5) 
        / 
        (st.successCount + st.partialCount + st.failureCount) DESC
    """)
    List<Solution> findBestSolutions();
}
