package com.solvhub.repository.global;

import java.util.Optional;

import com.solvhub.model.User;
import com.solvhub.repository.GenericRepository;

public interface UserRepository extends GenericRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);


}
