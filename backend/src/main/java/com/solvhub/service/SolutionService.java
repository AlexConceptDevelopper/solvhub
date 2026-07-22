package com.solvhub.service;

import com.solvhub.dto.SolutionCreateDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.exception.InvalidDataException;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.SolutionMapper;
import com.solvhub.model.Problem;
import com.solvhub.model.Solution;
import com.solvhub.model.SolutionStats;
import com.solvhub.model.User;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.repository.global.SolutionStatsRepository;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.security.SecurityUtils;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolutionService {

    private final SolutionRepository repo;
    private final SolutionMapper mapper;
    private final ProblemRepository problemRepository;
    private final SolutionStatsRepository solutionStatsRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    public SolutionService(
            SolutionRepository repo,
            SolutionMapper mapper,
            ProblemRepository problemRepository,
            SolutionStatsRepository solutionStatsRepository,
            UserRepository userRepository,
            SecurityUtils securityUtils) {

        this.repo = repo;
        this.mapper = mapper;
        this.problemRepository = problemRepository;
        this.solutionStatsRepository = solutionStatsRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils; // <--- Oubli réparé ici !
    }

    public List<Solution> findAll() {
        return repo.findAll();
    }

    public Solution save(Solution solution) {
        return repo.save(solution);
    }

    @Transactional
    public List<SolutionDTO> findAllDTO() {
        return repo.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional
    public SolutionDTO findByIdDTO(Integer id) {
        Solution solution = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Solution introuvable"));

        return mapper.toDTO(solution);
    }

    @Transactional
    public SolutionDTO createSolution(SolutionCreateDTO dto) {

        Problem problem = problemRepository.findById(dto.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problème introuvable"));

        User user = userRepository.findById(1)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Solution solution = new Solution();

        solution.setTitle(dto.getTitle());
        solution.setSteps(dto.getSteps());
        solution.setDifficulty(dto.getDifficulty());
        solution.setTimeMinutes(dto.getTimeMinutes());
        solution.setRiskLevel(dto.getRiskLevel());
        solution.setProblem(problem);
        solution.setUser(user);

        Solution saved = repo.save(solution);

        SolutionStats stats = new SolutionStats();
        stats.setSolution(saved);

        solutionStatsRepository.save(stats);

        return mapper.toDTO(saved);
    }

    @Transactional
    public void delete(Integer id) {
        // 1. Vérifier si la solution existe
        Solution solution = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solution introuvable pour suppression"));

        // 2. Supprimer d'abord les statistiques associées (obligatoire à cause de la
        // clé étrangère)
        // Si tu as une relation OneToOne dans l'entité Solution,
        // tu peux aussi configurer cascade = CascadeType.REMOVE dans l'entité.
        solutionStatsRepository.deleteBySolution(solution);

        // 3. Supprimer la solution
        repo.delete(solution);
    }

    @Transactional
    public SolutionDTO updateSolution(Integer id, SolutionDTO dto) {
        Solution solution = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solution introuvable pour mise à jour"));

        // Récupérer proprement l'email et le username du créateur de la solution (s'ils existent)
        String ownerEmail = solution.getUser() != null ? solution.getUser().getEmail() : null;
        String ownerUsername = solution.getUser() != null ? solution.getUser().getUsername() : null;

        // Utilisation propre et factorisée de SecurityUtils (principe DRY respecté)
        if (!securityUtils.isOwnerOrAdmin(ownerEmail, ownerUsername)) {
            throw new InvalidDataException("Action non autorisée : vous ne pouvez modifier que vos propres solutions.");
        }

        // Mise à jour des champs modifiables
        solution.setTitle(dto.getTitle());
        solution.setDifficulty(dto.getDifficulty());
        solution.setTimeMinutes(dto.getTimeMinutes());

        Solution updated = repo.save(solution);
        return mapper.toDTO(updated);
    }
}