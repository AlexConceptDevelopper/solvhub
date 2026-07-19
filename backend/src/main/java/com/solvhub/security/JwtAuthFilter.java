package com.solvhub.security;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (jwtUtil.isTokenValid(token)) {
            String email = jwtUtil.extractEmail(token);
            
            // C'est ici qu'il manquait la recherche de l'utilisateur !
            User user = userRepository.findByEmail(email).orElse(null);

            if (user != null) {
                // 1. Extraire le rôle du token
                String role = jwtUtil.extractRole(token);

                // 2. Créer l'autorité avec le préfixe "ROLE_"
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                // 3. Créer le token d'authentification avec l'autorité
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(user, null, List.of(authority));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}