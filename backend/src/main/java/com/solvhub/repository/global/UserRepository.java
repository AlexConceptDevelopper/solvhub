package com.solvhub.repository.global;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import com.solvhub.dto.UserDTO;
import com.solvhub.model.User;
import com.solvhub.repository.GenericRepository;

public interface UserRepository extends GenericRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);


}
