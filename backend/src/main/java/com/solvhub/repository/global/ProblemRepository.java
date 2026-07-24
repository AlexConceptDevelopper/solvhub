package com.solvhub.repository.global;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import com.solvhub.model.Problem;
import com.solvhub.repository.GenericRepository;

public interface ProblemRepository extends GenericRepository<Problem, Integer> {

    @Query("SELECT p FROM Problem p " +
           "LEFT JOIN Solution s ON s.problem.idProblem = p.idProblem " +
           "LEFT JOIN Vote v ON v.solution.idSolution = s.idSolution " +
           "GROUP BY p " +
           "ORDER BY COUNT(v) DESC, p.createdAt DESC")
    List<Problem> findPopularProblems(Pageable pageable);
}