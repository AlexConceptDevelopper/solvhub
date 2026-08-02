package com.solvhub.mapper;

import org.springframework.stereotype.Component;

import com.solvhub.dto.UserDTO;
import com.solvhub.model.User;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        return new UserDTO(
                user.getIdUsers(),
                user.getUsername(),
                user.getEmail(),
                null,
                user.getBadge(),
                user.getRole(),
                user.getEmailNotificationsEnabled(),
                user.isGoogleAccount()
        );
    }

    // Surcharge pour mapper avec le nombre de solutions (pratique pour le classement)
   public UserDTO toDTOWithSolutionsCount(User user, Long solutionsCount) {
        if (user == null) {
            return null;
        }

        return new UserDTO(
                user.getIdUsers(),
                user.getUsername(),
                user.getEmail(),
                solutionsCount, 
                user.getBadge(),
                user.getRole(),
                user.getEmailNotificationsEnabled(),
                user.isGoogleAccount()
        );
    }
}