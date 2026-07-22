package com.solvhub.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public Authentication getCurrentAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getCurrentUsername() {
        return getCurrentAuthentication().getName();
    }

    public boolean isAdmin() {
        return getCurrentAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
    }

    public boolean isOwnerOrAdmin(String ownerEmail, String ownerUsername) {
        if (isAdmin()) {
            return true;
        }
        String currentPrincipal = getCurrentUsername();
        return (ownerEmail != null && ownerEmail.equals(currentPrincipal)) ||
               (ownerUsername != null && ownerUsername.equals(currentPrincipal));
    }
}
