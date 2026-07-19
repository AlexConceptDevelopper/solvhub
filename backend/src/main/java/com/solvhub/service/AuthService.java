package com.solvhub.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.solvhub.dto.AuthResponseDTO;
import com.solvhub.dto.LoginDTO;
import com.solvhub.dto.RegisterDTO;
import com.solvhub.exception.ResourceNotFoundException;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    public void register(RegisterDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà pris");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setChecked(false);
        user.setRole("USER");
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiry(Instant.now().plusSeconds(86400)); // 24h

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationToken());
    }

    public void verifyEmail(String token) {
        // 1. On cherche l'utilisateur par le token
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token invalide ou déjà utilisé."));

        // 2. Vérification de l'expiration
        if (user.getVerificationTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Le token de vérification a expiré.");
        }

        // 3. Si tout est bon, on valide
        user.setChecked(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);

        userRepository.save(user);
    }

    public AuthResponseDTO login(LoginDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new ResourceNotFoundException("Email ou mot de passe incorrect");
        }

        if (!user.isChecked()) {
            throw new IllegalStateException("Veuillez vérifier votre email avant de vous connecter");
        }

        // On génère le token en incluant le rôle
        String token = jwtUtil.generateToken(user.getIdUsers(), user.getEmail(), user.getRole());

        // La parenthèse de fermeture est tout à la fin !
        return new AuthResponseDTO(
                token,
                user.getIdUsers(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}
