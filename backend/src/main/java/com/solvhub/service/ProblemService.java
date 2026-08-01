package com.solvhub.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.solvhub.dto.CreateProblemDTO;
import com.solvhub.dto.ProblemDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.exception.ForbiddenException;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.mapper.ProblemMapper;
import com.solvhub.mapper.SolutionMapper;
import com.solvhub.model.Category;
import com.solvhub.model.Equipment;
import com.solvhub.model.Problem;
import com.solvhub.model.Solution;
import com.solvhub.model.User;
import com.solvhub.repository.global.CategoryRepository;
import com.solvhub.repository.global.EquipmentRepository;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.repository.global.VoteRepository;
import com.solvhub.security.SecurityUtils;

import jakarta.transaction.Transactional;

@Service
public class ProblemService {

    private final SolutionRepository solutionRepository;
    private final SolutionMapper solutionMapper;
    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;
    private final CategoryRepository categoryRepository;
    private final EquipmentRepository equipmentRepository;
    private final VoteRepository voteRepository;
    private final SecurityUtils securityUtils;

    public ProblemService(
            SolutionRepository solutionRepository,
            SolutionMapper solutionMapper,
            ProblemRepository problemRepository,
            ProblemMapper problemMapper,
            CategoryRepository categoryRepository,
            EquipmentRepository equipmentRepository,
            SecurityUtils securityUtils,
            VoteRepository voteRepository) {
        this.solutionRepository = solutionRepository;
        this.solutionMapper = solutionMapper;
        this.problemRepository = problemRepository;
        this.problemMapper = problemMapper;
        this.categoryRepository = categoryRepository;
        this.equipmentRepository = equipmentRepository;
        this.voteRepository = voteRepository;
        this.securityUtils = securityUtils;
    }

    public List<ProblemDTO> findAllDTO() {
        return problemRepository.findAll()
                .stream()
                .map(problemMapper::toDTO)
                .toList();
    }

    public List<SolutionDTO> getSolutionsByProblem(Integer idProblem) {
        List<Solution> solutions = solutionRepository.findByProblemIdProblem(idProblem);

        return solutions.stream()
                .map(solutionMapper::toDTO)
                .toList();
    }

    public ProblemDTO findByIdDTO(Integer id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problème introuvable"));

        return problemMapper.toDTO(problem);
    }

    @Transactional
    public ProblemDTO create(CreateProblemDTO dto) {
        Category category = categoryRepository.findById(dto.getIdCategory())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable"));

        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Problem problem = new Problem();
        problem.setTitle(dto.getTitle());
        problem.setDescription(dto.getDescription());
        problem.setCategory(category);
        problem.setUser(currentUser);

        if (dto.getIdEquipment() != null) {
            Equipment equipment = equipmentRepository.findById(dto.getIdEquipment())
                    .orElseThrow(() -> new ResourceNotFoundException("Équipement introuvable"));
            problem.setEquipment(equipment);
        }

        problemRepository.save(problem);

        return problemMapper.toDTO(problem);
    }

    @Transactional
    public ProblemDTO update(Integer id, ProblemDTO dto) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problème introuvable"));

        String ownerEmail = problem.getUser() != null ? problem.getUser().getEmail() : null;
        String ownerUsername = problem.getUser() != null ? problem.getUser().getUsername() : null;

        if (!securityUtils.isOwnerOrAdmin(ownerEmail, ownerUsername)) {
            throw new ForbiddenException("Vous n'avez pas les droits pour modifier ce problème.");
        }

        if (dto.getTitle() != null) {
            problem.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            problem.setDescription(dto.getDescription());
        }
        if (dto.getCategory() != null && dto.getCategory().getIdCategory() != null) {
            Category category = categoryRepository.findById(dto.getCategory().getIdCategory())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie introuvable"));
            problem.setCategory(category);
        }

        problemRepository.save(problem);
        return problemMapper.toDTO(problem);
    }

    @Transactional
    public void delete(Integer id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problème introuvable"));

        String ownerEmail = problem.getUser() != null ? problem.getUser().getEmail() : null;
        String ownerUsername = problem.getUser() != null ? problem.getUser().getUsername() : null;

        if (!securityUtils.isOwnerOrAdmin(ownerEmail, ownerUsername)) {
            throw new ForbiddenException("Vous n'avez pas les droits pour supprimer ce problème.");
        }

        problemRepository.delete(problem);
    }

    public List<ProblemDTO> getPopularProblemsByVotes() {
        List<ProblemDTO> problems = problemRepository.findAll()
                .stream()
                .map(problemMapper::toDTO)
                .toList();

        for (ProblemDTO dto : problems) {
            List<Solution> solutions = solutionRepository.findByProblemIdProblem(dto.getIdProblem());

            long totalVotes = 0;
            for (Solution s : solutions) {
                long votesForSolution = voteRepository.countBySolutionIdSolution(s.getIdSolution());
                totalVotes += votesForSolution;
            }

            dto.setVoteCount(totalVotes);
        }

        return problems.stream()
                .sorted((p1, p2) -> {
                    Long v1 = p1.getVoteCount() == null ? 0L : p1.getVoteCount();
                    Long v2 = p2.getVoteCount() == null ? 0L : p2.getVoteCount();
                    int voteCompare = Long.compare(v2, v1);
                    if (voteCompare != 0) {
                        return voteCompare;
                    }
                    return p2.getCreatedAt().compareTo(p1.getCreatedAt());
                })
                .toList();
    }

    public List<ProblemDTO> getTop3PopularProblems() {
        List<Problem> topProblems = problemRepository.findPopularProblems(PageRequest.of(0, 3));

        return topProblems.stream()
                .map(problem -> {
                    ProblemDTO dto = problemMapper.toDTO(problem);
                    List<Solution> solutions = solutionRepository.findByProblemIdProblem(dto.getIdProblem());
                    long totalVotes = solutions.stream()
                            .mapToLong(s -> voteRepository.countBySolutionIdSolution(s.getIdSolution()))
                            .sum();
                    dto.setVoteCount(totalVotes);
                    return dto;
                })
                .toList();
    }

    public List<ProblemDTO> findPossibleDuplicates(String newTitle, String newDescription, Integer categoryId,
            Integer equipmentId) {
        List<Problem> existingProblems = problemRepository.findAll();

        String queryTitle = cleanAndNormalize(newTitle);

        return existingProblems.stream().filter(problem -> {
            if (problem.getCategory() != null && categoryId != null
                    && !problem.getCategory().getIdCategory().equals(categoryId)) {
                return false;
            }
            String existingTitle = cleanAndNormalize(problem.getTitle());
            double similarityScore = calculateJaccardSimilarity(queryTitle, existingTitle);

            return similarityScore > 0.20;
        })
                .map(problemMapper::toDTO)
                .toList();
    }

    private String cleanAndNormalize(String text) {
        if (text == null)
            return "";
        return text.toLowerCase()
                .replaceAll("[^a-z0-9àâäéèêëîïôöùûüç\\s]", "")
                .trim();
    }

    private double calculateJaccardSimilarity(String text1, String text2) {
        String[] words1 = text1.split("\\s+");
        String[] words2 = text2.split("\\s+");

        java.util.Set<String> set1 = new java.util.HashSet<>(java.util.Arrays.asList(words1));
        java.util.Set<String> set2 = new java.util.HashSet<>(java.util.Arrays.asList(words2));

        java.util.Set<String> intersection = new java.util.HashSet<>(set1);
        intersection.retainAll(set2);

        java.util.Set<String> union = new java.util.HashSet<>(set1);
        union.addAll(set2);

        if (union.isEmpty())
            return 0.0;
        return (double) intersection.size() / union.size();
    }

    @Transactional
    public List<ProblemDTO> getProblemsByUser(Integer userId) {
        return problemRepository.findByUserIdUsers(userId)
                .stream()
                .map(problemMapper::toDTO)
                .toList();
    }
}