package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.solvhub.controller.GenericController;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.service.UserService;
import com.solvhub.dto.ChangePasswordDTO;
import com.solvhub.dto.MessageResponse;
import com.solvhub.dto.UserDTO;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserRepository repository, UserService userService) {
        this.userService = userService;
    }

// Remplace la route principale /api/users pour qu'elle renvoie le DTO sécurisé

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersDto());
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Integer id, @RequestBody UserDTO userDTO) {
        return userService.update(id, userDTO);
    }

    // --Top contributeur--
    @GetMapping("/top-contributors")
    public ResponseEntity<List<UserDTO>> getTopContributors() {
        List<UserDTO> topContributors = userService.getTopContributors();
        return ResponseEntity.ok(topContributors);
    }

    // Top 3 contributor
    @GetMapping("/top-contributors/top3")
    public List<UserDTO> getTop3Contributors() {
        return userService.getTop3Contributors();
    }

    // change password
    @PostMapping("/password")
    public MessageResponse changePassword(
            @RequestBody ChangePasswordDTO dto,
            @AuthenticationPrincipal User currentUser) { // Récupère l'utilisateur connecté via le JWT

        userService.changePassword(currentUser, dto);
        return new MessageResponse("Mot de passe mis à jour avec succès.");
    }
}
