package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.dto.SolutionStatsDTO;
import com.solvhub.service.SolutionService;
import com.solvhub.service.SolutionStatsService;
import com.solvhub.dto.SolutionCreateDTO;

@RestController
@RequestMapping("/api/solutions")
@CrossOrigin(origins = "*")
public class SolutionController {

    private final SolutionService solutionService;
    private final SolutionStatsService solutionStatsService;

    public SolutionController(
            SolutionService solutionService,
            SolutionStatsService solutionStatsService) {
        this.solutionService = solutionService;
        this.solutionStatsService = solutionStatsService;
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
        return solutionStatsService.getStatsDTO(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolutionDTO create(
            @RequestBody SolutionCreateDTO dto) {

        return solutionService.createSolution(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        solutionService.delete(id); // Assure-toi que ton service gère la suppression
        return ResponseEntity.noContent().build();
    }
}