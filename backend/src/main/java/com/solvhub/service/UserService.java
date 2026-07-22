package com.solvhub.service;

import org.springframework.stereotype.Service;
import com.solvhub.exception.InvalidDataException;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.security.SecurityUtils;
import com.solvhub.dto.UserDTO;
import com.solvhub.mapper.UserMapper;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SecurityUtils securityUtils;

    public UserService(UserRepository userRepository, UserMapper userMapper, SecurityUtils securityUtils) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.securityUtils = securityUtils;
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
        userToModify.setUsername(dto.getUsername());
        userToModify.setEmail(dto.getEmail());

        User savedUser = userRepository.save(userToModify);
        return userMapper.toDTO(savedUser);
    }
}