package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.solvhub.dto.SolutionDTO;
import com.solvhub.dto.SolutionStatsDTO;
import com.solvhub.service.SolutionService;
import com.solvhub.service.SolutionStatsService;
import com.solvhub.dto.SolutionCreateDTO;

@RestController
@RequestMapping("/api/solutions")
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SolutionDTO> createSolution(
            @ModelAttribute SolutionCreateDTO dto,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "videoUrl", required = false) String videoUrl) {
        SolutionDTO created = solutionService.createSolution(dto, images, videoUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        solutionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public SolutionDTO update(
            @PathVariable Integer id,
            @RequestBody SolutionDTO dto) {
        return solutionService.updateSolution(id, dto);
    }
}