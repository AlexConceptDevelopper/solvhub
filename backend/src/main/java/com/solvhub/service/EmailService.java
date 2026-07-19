package com.solvhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Vérifiez votre compte SolvHub");
        message.setText(
                "Bienvenue sur SolvHub !\n\n" +
                "Cliquez sur ce lien pour vérifier votre compte :\n" +
                frontendUrl + "/verify?token=" + token + "\n\n" +
                "Ce lien expire dans 24 heures."
        );
        mailSender.send(message);
    }
}
