package com.solvhub.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.solvhub.exception.InvalidDataException;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.model.Problem;
import com.solvhub.model.Solution;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.repository.global.VoteRepository;

import com.solvhub.dto.ChangePasswordDTO;
import com.solvhub.dto.UserDTO;
import com.solvhub.mapper.UserMapper;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SolutionRepository solutionRepository;
    private final ProblemRepository problemRepository;
    private final VoteRepository voteRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            SolutionRepository solutionRepository,
            ProblemRepository problemRepository,
            VoteRepository voteRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.solutionRepository = solutionRepository;
        this.problemRepository = problemRepository;
        this.voteRepository = voteRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsersDto() {
        return userRepository.findAll().stream()
                .map(user -> {
                    Long solutionCount = solutionRepository.countByUser_IdUsers(user.getIdUsers());
                    return getUserWithBadge(user, solutionCount);
                })
                .toList();
    }

    public UserDTO update(Integer userId, UserDTO dto) {
        User userToModify = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'ID : " + userId));

        // Mise à jour du username
        if (dto.getUsername() != null && !dto.getUsername().trim().isEmpty()) {
            userToModify.setUsername(dto.getUsername());
        }

        // Mise à jour du rôle
        if (dto.getRole() != null && !dto.getRole().trim().isEmpty()) {
            userToModify.setRole(dto.getRole());
        }

        // Mise à jour des notifications
        if (dto.getEmailNotificationsEnabled() != null) {
            userToModify.setEmailNotificationsEnabled(dto.getEmailNotificationsEnabled());
        }

        User savedUser = userRepository.save(userToModify);
        return userMapper.toDTO(savedUser);
    }

    public UserDTO getUserDtoById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'ID : " + userId));
        return userMapper.toDTO(user);
    }

    public UserDTO getUserWithBadge(User user, Long solutionCount) {
        UserDTO dto = userMapper.toDTOWithSolutionsCount(user, solutionCount);

        // Badge spécial pour les comptes pionniers (IDs 4, 5, 6, 7 par exemple)
        if (List.of(4, 5, 6, 7).contains(user.getIdUsers())) {
            dto.setBadge("🚀 Pionnier");
            return dto;
        }

        // Attribution dynamique classique selon le nombre de solutions
        if (solutionCount >= 100) {
            dto.setBadge("🏆 Maître SolvHub");
        } else if (solutionCount >= 50) {
            dto.setBadge("🧠 Expert");
        } else if (solutionCount >= 10) {
            dto.setBadge("💡 Résolveur");
        } else {
            dto.setBadge("⚡ Actif");
        }

        return dto;
    }

    // --- MÉTHODE POUR LA LISTE COMPLÈTE DES CONTRIBUTEURS ---
    public List<UserDTO> getTopContributors() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> {
                    // On compte via le vrai repo de solutions (source de vérité)
                    Long solutionCount = solutionRepository.countByUser_IdUsers(user.getIdUsers());
                    // On utilise ta méthode existante qui gère le mapping et le badge
                    return getUserWithBadge(user, solutionCount);
                })
                .sorted((u1, u2) -> {
                    // 1. On trie d'abord par nombre de solutions (du plus grand au plus petit)
                    int cmp = Long.compare(u2.getSolutionCount(), u1.getSolutionCount());
                    if (cmp == 0) {
                        // 2. En cas d'égalité, on départage par ordre alphabétique du pseudo (A-Z)
                        return u1.getUsername().compareToIgnoreCase(u2.getUsername());
                    }
                    return cmp;
                })
                .toList();
    }

    // --- MÉTHODE POUR LE TOP 3 ---
    public List<UserDTO> getTop3Contributors() {
        return getTopContributors().stream()
                .limit(3)
                .toList();
    }

    // Change passwordHash
    public void changePassword(User currentUser, ChangePasswordDTO dto) {

        if (!passwordEncoder.matches(dto.getOldPassword(), currentUser.getPasswordHash())) {
            throw new InvalidDataException("L'ancien mot de passe est incorrect.");
        }

        // 2. Encoder le nouveau mot de passe et sauvegarder
        currentUser.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'ID : " + userId));

        // 1. Supprimer les votes que CET utilisateur a donnés sur les solutions des autres
        voteRepository.deleteByUserIdUsers(userId);

        // 2. Pour chaque solution créée par l'utilisateur : supprimer d'abord les votes reçus dessus
        List<Solution> userSolutions = solutionRepository.findByUser(user);
        for (Solution solution : userSolutions) {
            voteRepository.deleteBySolutionIdSolution(solution.getIdSolution());
        }
        // Puis supprimer les solutions elles-mêmes
        // (cascade déjà gérée vers SolutionStats/SolutionMedia via CascadeType.ALL)
        solutionRepository.deleteAll(userSolutions);

        // 3. Pour chaque problème créé par l'utilisateur : même chose pour ses solutions restantes
        List<Problem> userProblems = problemRepository.findByUserIdUsers(userId);
        for (Problem problem : userProblems) {
            List<Solution> problemSolutions = solutionRepository.findByProblemIdProblem(problem.getIdProblem());
            for (Solution solution : problemSolutions) {
                voteRepository.deleteBySolutionIdSolution(solution.getIdSolution());
            }
            // La suppression du problem cascade déjà vers ses solutions restantes
            // (CascadeType.REMOVE, orphanRemoval = true sur Problem.solutions)
        }
        problemRepository.deleteAll(userProblems);

        // 4. Enfin, supprimer le compte utilisateur lui-même
        userRepository.delete(user);
    }

}