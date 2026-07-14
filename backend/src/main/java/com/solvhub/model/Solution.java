package com.solvhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "solution")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSolution;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String steps;

    @Column(nullable = false)
    private Integer difficulty;

    @Column(nullable = false)
    private Integer timeMinutes;

    @Column(nullable = false)
    private Integer riskLevel;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();


    // 🔗 Une solution appartient à un problème
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_problem", nullable = false)
    private Problem problem;


    // 🔗 Une solution peut avoir un créateur
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_users", nullable = true)
    private User user;


    // 🔗 Une solution possède ses statistiques de ranking
    @OneToOne(mappedBy = "solution", cascade = CascadeType.ALL)
    private SolutionStats solutionStats;

}