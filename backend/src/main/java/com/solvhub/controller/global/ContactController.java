package com.solvhub.controller.global;

import com.solvhub.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"https://www.solvhub.fr", "http://localhost:3000"})
public class ContactController {

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        if (name == null || email == null || message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tous les champs sont obligatoires."));
        }

        try {
            emailService.sendContactEmail(email, name, message);
            return ResponseEntity.ok(Map.of("success", "Message envoyé avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur lors de l'envoi du message."));
        }
    }
}