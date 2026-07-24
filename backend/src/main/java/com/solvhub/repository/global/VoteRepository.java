package com.solvhub.repository.global;

import java.util.List;

import com.solvhub.model.Vote;
import com.solvhub.repository.GenericRepository;

public interface VoteRepository extends GenericRepository<Vote, Integer> {
    boolean existsByUserIdUsersAndSolutionIdSolution(
            Integer userId,
            Integer solutionId);

    List<Vote> findBySolutionIdSolution(Integer idSolution);

    long countBySolutionIdSolution(Integer idSolution);
}