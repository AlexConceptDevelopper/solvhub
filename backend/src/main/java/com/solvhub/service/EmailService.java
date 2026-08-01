package com.solvhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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
        // Utilisation obligatoire de l'adresse de test Resend au début
        message.setFrom("onboarding@resend.dev");
        message.setSubject("Vérifiez votre compte SolvHub");
        message.setText(
                "Bienvenue sur SolvHub !\n\n" +
                "Cliquez sur ce lien pour vérifier votre compte :\n" +
                frontendUrl + "/verify?token=" + token + "\n\n" +
                "Ce lien expire dans 24 heures."
        );
        mailSender.send(message);
    }

    public void sendNewSolutionNotification(String toEmail, String username, String problemTitle, Integer problemId) {
        String problemUrl = frontendUrl + "/problem/" + problemId;
        String subject = "Nouvelle solution pour votre problème : " + problemTitle;
        
        String htmlContent = "<div style=\"font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                           + "<h2 style=\"color: #4F46E5;\">SolvHub</h2>"
                           + "<p>Bonjour <strong>" + username + "</strong>,</p>"
                           + "<p>Une nouvelle solution vient d'être postée pour votre problème : <em>" + problemTitle + "</em></p>"
                           + "<div style=\"text-align: center; margin: 30px 0;\">"
                           + "<a href=\"" + problemUrl + "\" style=\"background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Voir la solution</a>"
                           + "</div>"
                           + "<p style=\"color: #6b7280; font-size: 0.9em;\">À bientôt sur SolvHub !</p>"
                           + "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            // Idem ici pour l'expéditeur
            helper.setFrom("onboarding@resend.dev");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail", e);
        }
    }
}