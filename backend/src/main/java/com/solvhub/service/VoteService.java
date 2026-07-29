package com.solvhub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.solvhub.dto.VoteCreateDTO;
import com.solvhub.dto.VoteDTO;
import com.solvhub.exception.DuplicateVoteException;
import com.solvhub.exception.InvalidDataException;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.VoteMapper;
import com.solvhub.model.Solution;
import com.solvhub.model.SolutionStats;
import com.solvhub.model.User;
import com.solvhub.model.Vote;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.repository.global.SolutionStatsRepository;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.repository.global.VoteRepository;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final SolutionStatsRepository statsRepository;
    private final SolutionRepository solutionRepository;
    private final UserRepository userRepository;
    private final VoteMapper voteMapper;

    public VoteService(
            VoteRepository voteRepository,
            SolutionStatsRepository statsRepository,
            SolutionRepository solutionRepository,
            UserRepository userRepository,
            VoteMapper voteMapper) {
        this.voteRepository = voteRepository;
        this.statsRepository = statsRepository;
        this.solutionRepository = solutionRepository;
        this.userRepository = userRepository;
        this.voteMapper = voteMapper;
    }

    @Transactional
    public VoteDTO addVote(VoteCreateDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Solution solution = solutionRepository.findById(dto.getSolutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Solution introuvable"));

        Vote vote = new Vote();

        vote.setStatus(dto.getStatus());
        vote.setComment(dto.getComment());
        vote.setUser(user);
        vote.setSolution(solution);

        if (voteRepository.existsByUserIdUsersAndSolutionIdSolution(
                dto.getUserId(),
                dto.getSolutionId())) {
            throw new DuplicateVoteException(
                    "Vous avez déjà voté pour cette solution"

            );
        }
        Vote savedVote = voteRepository.save(vote);

        SolutionStats stats = statsRepository
                .findBySolutionIdSolution(
                        dto.getSolutionId());

        if (stats == null) {
            stats = new SolutionStats();
            stats.setSolution(solution); // Associe la solution (selon ton modèle exact, vérifie le nom du setter)
            stats.setSuccessCount(0);
            stats.setPartialCount(0);
            stats.setFailureCount(0);
            stats = statsRepository.save(stats); // On sauvegarde pour lui donner un ID / l'initialiser
        }

        switch (dto.getStatus().toUpperCase()) {

            case "SUCCESS":
                stats.setSuccessCount(stats.getSuccessCount() + 1);
                break;

            case "PARTIAL":
                stats.setPartialCount(stats.getPartialCount() + 1);
                break;

            case "FAILURE":
                stats.setFailureCount(stats.getFailureCount() + 1);
                break;

            default:
                throw new InvalidDataException(
                        "Statut de vote invalide : " + dto.getStatus());
        }

        statsRepository.save(stats);

        return voteMapper.toDTO(savedVote);
    }

    public boolean hasUserVoted(
            Integer userId,
            Integer solutionId) {
        return voteRepository
                .existsByUserIdUsersAndSolutionIdSolution(
                        userId,
                        solutionId);
    }

    public List<VoteDTO> findBySolution(Integer idSolution) {

        return voteRepository
                .findBySolutionIdSolution(idSolution)
                .stream()
                .map(voteMapper::toDTO)
                .toList();
    }

}