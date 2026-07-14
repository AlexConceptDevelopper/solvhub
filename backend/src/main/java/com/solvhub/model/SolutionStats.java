package com.solvhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "solution_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolutionStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSolutionStats;

    @Column(nullable = false)
    private Integer successCount = 0;

    @Column(nullable = false)
    private Integer partialCount = 0;

    @Column(nullable = false)
    private Integer failureCount = 0;

    @Column(nullable = false)
    private Instant lastUpdated = Instant.now();

    // 🔗 1 stats = 1 solution
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_solution", nullable = false, unique = true)
    private Solution solution;

    public double getScore() {
        int total = successCount + partialCount + failureCount;

        if (total == 0)
            return 0;

        return (successCount * 1.0 + partialCount * 0.5) / total;
    }
}
