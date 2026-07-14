package com.solvhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "votes", uniqueConstraints = @UniqueConstraint(columnNames = { "id_users", "id_solution" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idVotes;

    @Column(nullable = false)
    private String status;
    // ex: "SUCCESS", "FAILURE", "PARTIAL"

    @Column(length = 255)
    private String comment;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }

    // 🔗 USER
    @ManyToOne
    @JoinColumn(name = "id_users", nullable = false)
    private User user;

    // 🔗 SOLUTION
    @ManyToOne
    @JoinColumn(name = "id_solution", nullable = false)
    private Solution solution;
}