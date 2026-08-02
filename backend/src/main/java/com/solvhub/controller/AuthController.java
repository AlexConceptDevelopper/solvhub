package com.solvhub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.AuthResponseDTO;
import com.solvhub.dto.LoginDTO;
import com.solvhub.dto.RegisterDTO;
import com.solvhub.model.User;
import com.solvhub.dto.MessageResponse;
import com.solvhub.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse register(@RequestBody RegisterDTO dto) {
        authService.register(dto);
        return new MessageResponse("Inscription réussie. Vérifiez votre email pour activer votre compte.");
    }

    @GetMapping("/verify")
    public MessageResponse verify(@RequestParam String token) {
        authService.verifyEmail(token);
        return new MessageResponse("Compte vérifié avec succès. Vous pouvez maintenant vous connecter.");
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginDTO dto) {
        return authService.login(dto);
    }

    @GetMapping("/me")
    public AuthResponseDTO getCurrentUser(@AuthenticationPrincipal User user) {
        // Retourne un format similaire à AuthResponseDTO (token, idUsers, username, email, role)
        return authService.buildAuthResponse(user); // Adapte selon ta méthode existante pour mapper l'User en DTO
    }
}