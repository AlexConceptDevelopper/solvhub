package com.solvhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key:}")
    private String resendApiKey;;

    @Value("${app.frontend-url:https://solvhub.fr}")
    private String frontendUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RESEND_URL = "https://api.resend.com/emails";

    public void sendVerificationEmail(String to, String token) {
        String verificationUrl = frontendUrl + "/verify?token=" + token;

        String htmlContent = "<div style=\"font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                +
                "<h2 style=\"color: #4F46E5;\">SolvHub</h2>" +
                "<p>Bienvenue sur SolvHub !</p>" +
                "<p>Pour vérifier votre compte, veuillez cliquer sur le lien ci-dessous :</p>" +
                "<p style=\"margin: 30px 0;\">" +
                "<a href=\"" + verificationUrl
                + "\" target=\"_blank\" style=\"color: #4F46E5; font-size: 16px; font-weight: bold; text-decoration: underline;\">👉 Cliquer ici pour vérifier mon compte</a>"
                +
                "</p>" +
                "<p style=\"font-size: 0.9em; color: #555;\">Si le lien ne fonctionne pas, copiez-collez cette URL dans votre navigateur :<br>"
                +
                "<span style=\"color: #6b7280; word-break: break-all;\">" + verificationUrl + "</span></p>" +
                "<p style=\"color: #6b7280; font-size: 0.9em;\">Ce lien expire dans 24 heures.</p>" +
                "<p style=\"color: #6b7280; font-size: 0.9em;\">À bientôt sur SolvHub !</p>" +
                "</div>";

        sendEmailViaApi(to, "Vérifiez votre compte SolvHub", htmlContent, true);
    }

    public void sendNewSolutionNotification(String toEmail, String username, String problemTitle, Integer problemId) {
        String problemUrl = frontendUrl + "/problem/" + problemId;
        String subject = "Nouvelle solution pour votre problème : " + problemTitle;

        String htmlContent = "<div style=\"font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;\">"
                + "<h2 style=\"color: #4F46E5;\">SolvHub</h2>"
                + "<p>Bonjour <strong>" + username + "</strong>,</p>"
                + "<p>Une nouvelle solution vient d'être postée pour votre problème : <em>" + problemTitle + "</em></p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + problemUrl
                + "\" style=\"background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Voir la solution</a>"
                + "</div>"
                + "<p style=\"color: #6b7280; font-size: 0.9em;\">À bientôt sur SolvHub !</p>"
                + "</div>";

        sendEmailViaApi(toEmail, subject, htmlContent, true);
    }

    private void sendEmailViaApi(String to, String subject, String content, boolean isHtml) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("from", "contact@solvhub.fr");
            body.put("to", new String[] { to });
            body.put("subject", subject);

            if (isHtml) {
                body.put("html", content);
            } else {
                body.put("text", content);
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(RESEND_URL, request, String.class);

        } catch (Exception e) {
            System.err.println("Erreur envoi email Resend API : " + e.getMessage());
        }
    }
}