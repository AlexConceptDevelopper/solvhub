package com.solvhub.controller.global;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.CreateProblemDTO;
import com.solvhub.dto.ProblemCheckRequestDTO;
import com.solvhub.dto.ProblemDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.service.ProblemService;


@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(
            ProblemRepository repository,
            ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping("/{id}/solutions")
    public List<SolutionDTO> getSolutionsByProblem(
            @PathVariable Integer id) {
        return problemService.getSolutionsByProblem(id);
    }

    // findall DTO
    @GetMapping("/dto")
    public List<ProblemDTO> getAllDTO() {
        return problemService.findAllDTO();
    }

    // finbyid DTO
    @GetMapping("/dto/{id}")
    public ProblemDTO getByIdDTO(
            @PathVariable Integer id) {
        return problemService.findByIdDTO(id);
    }

    // findall by popular problems
    @GetMapping("/dto/popular")
    public List<ProblemDTO> getAllPopularProblems() {
        return problemService.getPopularProblemsByVotes();
    }

    // Top 3 des problèmes populaires pour le hub
    @GetMapping("/dto/popular/top3")
    public List<ProblemDTO> getTop3PopularProblems() {
        return problemService.getTop3PopularProblems();
    }

    @PostMapping
    public ProblemDTO create(
            @RequestBody CreateProblemDTO dto) {

        return problemService.create(dto);
    }

    @PutMapping("/{id}")
    public ProblemDTO update(
            @PathVariable Integer id,
            @RequestBody ProblemDTO dto) {
        return problemService.update(id, dto);
    }

  
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        problemService.delete(id);
    }

    @PostMapping("/check-duplicates")
    public List<ProblemDTO> checkDuplicates(@RequestBody ProblemCheckRequestDTO dto) {
        return problemService.findPossibleDuplicates(
            dto.getTitle(), 
            dto.getDescription(), 
            dto.getCategoryId(), 
            dto.getEquipmentId()
        );
    }
}