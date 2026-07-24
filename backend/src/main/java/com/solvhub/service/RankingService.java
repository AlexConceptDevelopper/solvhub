package com.solvhub.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.mapper.SolutionMapper;
import com.solvhub.repository.global.SolutionRepository;

@Service
public class RankingService {

    private final SolutionRepository repo;
    private final SolutionMapper mapper;

    public RankingService(
            SolutionRepository repo,
            SolutionMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    // Tous les classements / meilleures solutions triés par score décroissant
    public List<SolutionDTO> getBestSolutions() {
        return repo.findAll()
                .stream()
                .map(mapper::toDTO)
                // Tri par score décroissant (les plus grands scores en premier, null gérés
                // proprement à la fin)
                .sorted(Comparator.comparing(SolutionDTO::getScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    // 🏆 Le Top 3 des meilleures solutions pour le Hub
    public List<SolutionDTO> getTop3BestSolutions() {
        return getBestSolutions().stream()
                .limit(3)
                .toList();
    }
}