package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.dto.SolutionStatsDTO;
import com.solvhub.mapper.SolutionStatsMapper;
import com.solvhub.model.SolutionStats;
import com.solvhub.repository.global.SolutionRepository;
import com.solvhub.repository.global.SolutionStatsRepository;
import com.solvhub.service.SolutionService;
import com.solvhub.dto.SolutionCreateDTO;

@RestController
@RequestMapping("/api/solutions")
@CrossOrigin(origins = "*")
public class SolutionController {

    private final SolutionService solutionService;
    private final SolutionStatsRepository statsRepository;

    private final SolutionStatsMapper statsMapper;

    public SolutionController(
            SolutionRepository repository,
            SolutionService solutionService,
            SolutionStatsRepository statsRepository,
            SolutionStatsMapper statsMapper) {

        this.solutionService = solutionService;
        this.statsRepository = statsRepository;
        this.statsMapper = statsMapper;
    }

    @GetMapping("/dto")
    public List<SolutionDTO> findAllDTO() {
        return solutionService.findAllDTO();
    }

    @GetMapping("/dto/{id}")
    public SolutionDTO findByIdDTO(
            @PathVariable Integer id) {
        return solutionService.findByIdDTO(id);
    }

    @GetMapping("/{id}/stats")
    public SolutionStatsDTO getStats(
            @PathVariable Integer id) {

        SolutionStats stats = statsRepository.findBySolutionIdSolution(id);

        return statsMapper.toDTO(stats);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolutionDTO create(
            @RequestBody SolutionCreateDTO dto) {

        return solutionService.createSolution(dto);
    }
}