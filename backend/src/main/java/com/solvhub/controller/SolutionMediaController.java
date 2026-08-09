package com.solvhub.controller;

import com.solvhub.dto.SolutionMediaDTO;
import com.solvhub.mapper.SolutionMediaMapper;
import com.solvhub.model.SolutionMedia;
import com.solvhub.repository.global.SolutionMediaRepository;
import com.solvhub.service.SolutionMediaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/solutions")
public class SolutionMediaController {

    private final SolutionMediaRepository mediaRepository;
    private final SolutionMediaService solutionMediaService;

    public SolutionMediaController(
            SolutionMediaRepository mediaRepository,
            SolutionMediaService solutionMediaService) {
        this.mediaRepository = mediaRepository;
        this.solutionMediaService = solutionMediaService;
    }

    @GetMapping("/{solutionId}/media")
    public ResponseEntity<List<SolutionMediaDTO>> getMediaBySolution(@PathVariable Integer solutionId) {
        List<SolutionMediaDTO> mediaList = mediaRepository.findBySolution_IdSolution(solutionId)
                .stream()
                .map(SolutionMediaMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(mediaList);
    }

    @DeleteMapping("/media/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable("id") Integer id) {
        SolutionMedia media = mediaRepository.findById(id).orElse(null);
        if (media == null) {
            return ResponseEntity.notFound().build();
        }
        solutionMediaService.deleteMedia(media);
        return ResponseEntity.noContent().build();
    }
}