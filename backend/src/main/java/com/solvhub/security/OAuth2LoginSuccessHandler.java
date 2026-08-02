package com.solvhub.security;

import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;


    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        
        // 1. Récupérer les infos de Google
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // 2. Chercher l'utilisateur en BDD ou le créer s'il n'existe pas
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            
            // Générer un username unique propre
            String baseUsername = (name != null ? name.replaceAll("\\s+", "").toLowerCase() : email.split("@")[0]);
            String username = baseUsername;
            int counter = 1;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + counter++;
            }
            newUser.setUsername(username);
            
            newUser.setPasswordHash(null); 
            newUser.setChecked(true); 
            newUser.setRole("USER");
            
            return userRepository.save(newUser);
        });

        // 3. Générer ton token JWT avec la bonne signature de ton JwtUtil
        String token = jwtUtil.generateToken(user.getIdUsers(), user.getEmail(), user.getRole());

        // 4. Rediriger vers le front-end avec le token
        String targetUrl = "https://solvhub.fr/oauth-success?token=" + token;
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}