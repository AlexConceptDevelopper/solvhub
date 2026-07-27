package com.solvhub.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.solvhub.exception.InvalidDataException;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.security.SecurityUtils;
import com.solvhub.dto.ChangePasswordDTO;
import com.solvhub.dto.UserDTO;
import com.solvhub.mapper.UserMapper;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SolutionRepository solutionRepository;
    private final UserMapper userMapper;
    private final SecurityUtils securityUtils;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, SolutionRepository solutionRepository, UserMapper userMapper,
            SecurityUtils securityUtils, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.solutionRepository = solutionRepository;
        this.userMapper = userMapper;
        this.securityUtils = securityUtils;
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

    public UserDTO update(Integer id, UserDTO dto) {
        // 1. On cherche l'utilisateur à modifier en base
        User userToModify = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'ID : " + id));

        // 2. On utilise userToModify (et non 'user') pour vérifier les droits
        if (!securityUtils.isOwnerOrAdmin(userToModify.getEmail(), userToModify.getUsername())) {
            throw new InvalidDataException("Action non autorisée : vous ne pouvez modifier que votre propre profil.");
        }

        // 3. Si c'est bon, on met à jour et on sauvegarde
        if (dto.getUsername() != null) {
            userToModify.setUsername(dto.getUsername());
        }
        if (dto.getEmail() != null) {
            userToModify.setEmail(dto.getEmail());
        }
        // Mise à jour de la préférence de notification si fournie
        if (dto.getEmailNotificationsEnabled() != null) {
            userToModify.setEmailNotificationsEnabled(dto.getEmailNotificationsEnabled());
        }

        User savedUser = userRepository.save(userToModify);
        return userMapper.toDTO(savedUser);
    }

    public UserDTO getUserWithBadge(User user, Long solutionCount) {
        UserDTO dto = userMapper.toDTOWithSolutionsCount(user, solutionCount);

        // Attribution dynamique du badge selon le nombre de solutions
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

}