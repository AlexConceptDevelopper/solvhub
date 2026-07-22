package com.solvhub.controller.global;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.service.RankingService;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping
    public List<SolutionDTO> getRanking() {
        return rankingService.getBestSolutions();
    }
}
