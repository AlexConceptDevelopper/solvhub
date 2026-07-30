package com.solvhub.service;

import com.solvhub.dto.SolutionCreateDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.exception.ForbiddenException;
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
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class SolutionService {

    private final SolutionRepository repo;
    private final SolutionMapper mapper;
    private final ProblemRepository problemRepository;
    private final SolutionStatsRepository solutionStatsRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final EmailService emailService;
    private final SolutionMediaService solutionMediaService;

    public SolutionService(
            SolutionRepository repo,
            SolutionMapper mapper,
            ProblemRepository problemRepository,
            SolutionStatsRepository solutionStatsRepository,
            UserRepository userRepository,
            SecurityUtils securityUtils,
            EmailService emailService,
            SolutionMediaService solutionMediaService) {

        this.repo = repo;
        this.mapper = mapper;
        this.problemRepository = problemRepository;
        this.solutionStatsRepository = solutionStatsRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
        this.emailService = emailService;
        this.solutionMediaService = solutionMediaService;
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
    public SolutionDTO createSolution(SolutionCreateDTO dto, List<MultipartFile> images, String videoUrl) {

        Problem problem = problemRepository.findById(dto.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problème introuvable"));

        // --- RÉCUPÉRATION DIRECTE DE L'OBJET USER DEPUIS LA SÉCURITÉ ---
        Authentication authentication = securityUtils.getCurrentAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new ResourceNotFoundException("Utilisateur connecté introuvable");
        }

        User user = (User) authentication.getPrincipal();

        Solution solution = new Solution();

        solution.setTitle(dto.getTitle());
        solution.setSteps(dto.getSteps());
        solution.setDifficulty(dto.getDifficulty());
        solution.setTimeMinutes(dto.getTimeMinutes());
        solution.setRiskLevel(dto.getRiskLevel());
        solution.setProblem(problem);
        solution.setUser(user);

        Solution saved = repo.save(solution);

        // --- UPLOAD DES IMAGES VERS CLOUDINARY ---
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    try {
                        solutionMediaService.uploadAndSaveMedia(image, saved);
                    } catch (IOException e) {
                        throw new InvalidDataException("Erreur lors de l'upload de l'image : " + e.getMessage());
                    }
                }
            }
        }

        if (videoUrl != null && !videoUrl.trim().isEmpty()) {
            solutionMediaService.saveVideoUrl(videoUrl, saved); // Utilisation de 'saved'
        }

        SolutionStats stats = new SolutionStats();
        stats.setSolution(saved);
        solutionStatsRepository.save(stats);

        // --- MISE À JOUR AUTOMATIQUE DU BADGE UTILISATEUR ---
        long totalSolutions = repo.countByUser(user);

        String newBadge;
        if (totalSolutions >= 100) {
            newBadge = "🏆 Maître SolvHub";
        } else if (totalSolutions >= 50) {
            newBadge = "🧠 Expert";
        } else if (totalSolutions >= 10) {
            newBadge = "💡 Résolveur";
        } else {
            newBadge = "⚡ Actif";
        }

        if (!newBadge.equals(user.getBadge())) {
            user.setBadge(newBadge);
            userRepository.save(user);
        }

        // --- ENVOI DE LA NOTIFICATION PAR E-MAIL ---
        User problemOwner = problem.getUser();

        if (problemOwner != null) {
            boolean isNotSelf = !problemOwner.getIdUsers().equals(user.getIdUsers());

            if (isNotSelf && Boolean.TRUE.equals(problemOwner.getEmailNotificationsEnabled())) {
                emailService.sendNewSolutionNotification(
                        problemOwner.getEmail(),
                        problemOwner.getUsername(),
                        problem.getTitle(),
                        problem.getIdProblem());
            }
        }

        return mapper.toDTO(saved);
    }

    @Transactional
    public void delete(Integer id) {
        // 1. Vérifier si la solution existe
        Solution solution = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solution introuvable pour suppression"));

        // 2. Récupération des infos du propriétaire
        String ownerEmail = solution.getUser() != null ? solution.getUser().getEmail() : null;
        String ownerUsername = solution.getUser() != null ? solution.getUser().getUsername() : null;

        // 3. Vérification des droits (Propriétaire ou Admin via SecurityUtils)
        if (!securityUtils.isOwnerOrAdmin(ownerEmail, ownerUsername)) {
            throw new ForbiddenException("Vous n'avez pas les droits pour supprimer cette solution.");
        }

        solutionStatsRepository.deleteBySolution(solution);
        repo.delete(solution);
    }

    @Transactional
    public SolutionDTO updateSolution(Integer id, SolutionDTO dto) {
        Solution solution = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solution introuvable pour mise à jour"));

        // Récupérer proprement l'email et le username du créateur de la solution (s'ils
        // existent)
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