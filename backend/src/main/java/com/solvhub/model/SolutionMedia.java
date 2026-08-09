package com.solvhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "solution_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolutionMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 500)
    private String url; // L'URL Cloudinary

    @Column(name = "public_id", length = 255)
    private String publicId; // identifiant Cloudinary nécessaire pour la suppression

    @Column(nullable = false)
    private String type; // "IMAGE" (et plus tard "VIDEO")

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_id", nullable = false)
    private Solution solution;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}