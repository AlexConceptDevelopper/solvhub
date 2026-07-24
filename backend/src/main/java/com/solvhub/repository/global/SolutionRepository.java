package com.solvhub.repository.global;

import java.util.List;

import com.solvhub.model.Solution;
import com.solvhub.model.User;
import com.solvhub.repository.GenericRepository;

public interface SolutionRepository extends GenericRepository<Solution, Integer> {

    List<Solution> findByProblemIdProblem(Integer idProblem);

    long countByUser_IdUsers(Integer idUsers);

    long countByUser(User user);
}
