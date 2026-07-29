package com.solvhub.controller;

import com.solvhub.dto.SolutionMediaDTO;
import com.solvhub.mapper.SolutionMediaMapper;
import com.solvhub.repository.global.SolutionMediaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/solutions")
public class SolutionMediaController {

    private final SolutionMediaRepository mediaRepository;

    public SolutionMediaController(SolutionMediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    // Récupérer tous les médias d'une solution par son ID
    @GetMapping("/{solutionId}/media")
    public ResponseEntity<List<SolutionMediaDTO>> getMediaBySolution(@PathVariable Integer solutionId) {
        List<SolutionMediaDTO> mediaList = mediaRepository.findBySolution_IdSolution(solutionId)
                .stream()
                .map(SolutionMediaMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(mediaList);
    }
}
