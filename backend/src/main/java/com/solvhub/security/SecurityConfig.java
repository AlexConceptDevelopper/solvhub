package com.solvhub.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC : Authentification et toutes les lectures (GET) autorisées
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/categories/**",
                                "/api/problems/**",
                                "/api/solutions/**",
                                "/api/votes/**",
                                "/api/ranking/**",
                                "/api/users/top-contributors",
                                "/api/users/top-contributors/top3",
                                "/api/problems/dto/popular",
                                "/api/equipments/brands",
                                "/api/equipments/models")
                        .permitAll()

                        // contact form endpoint
                        .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()

                        // 2. ADMIN : Routes critiques et globales réservées exclusivement à l'Admin
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/equipments/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/equipments/**", "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/equipments/**", "/api/categories/**")
                        .hasRole("ADMIN") // 👈 /api/solutions/** a été retiré d'ici

                        // 3. AUTHENTIFIÉ (Owner / User) : Création et modification/suppression gérées
                        // finement par le service
                        .requestMatchers(HttpMethod.POST, "/api/problems/**", "/api/solutions/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/problems/**", "/api/solutions/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/problems/**", "/api/solutions/**").authenticated() // 👈 Ajout de /api/solutions/** ici

                        // 4. Tout le reste nécessite d'être authentifié
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Autoriser ton front de dev ET ton front de production sur Railway
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "https://solvhub.fr",
            "https://www.solvhub.fr"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}