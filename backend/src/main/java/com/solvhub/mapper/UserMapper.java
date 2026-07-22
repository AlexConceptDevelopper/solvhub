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
                user.getEmail()
        );
    }
}
