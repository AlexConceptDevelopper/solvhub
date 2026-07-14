package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.VoteDTO;
import com.solvhub.model.Vote;

@Component
public class VoteMapper {


    public VoteDTO toDTO(Vote vote) {

        if (vote == null) {
            return null;
        }


        Integer userId = null;
        Integer solutionId = null;


        if (vote.getUser() != null) {
            userId = vote.getUser().getIdUsers();
        }


        if (vote.getSolution() != null) {
            solutionId = vote.getSolution().getIdSolution();
        }


        return new VoteDTO(
                vote.getIdVotes(),
                vote.getStatus(),
                vote.getComment(),
                vote.getCreatedAt(),
                userId,
                solutionId
        );
    }
}
