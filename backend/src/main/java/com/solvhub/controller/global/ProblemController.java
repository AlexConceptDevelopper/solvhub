package com.solvhub.controller.global;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.solvhub.controller.GenericController;
import com.solvhub.dto.ProblemDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.model.Problem;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.service.ProblemService;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "*")
public class ProblemController extends GenericController<Problem, Integer> {

    private final ProblemService problemService;

    public ProblemController(
            ProblemRepository repository,
            ProblemService problemService) {
        super(repository);
        this.problemService = problemService;
    }

    @GetMapping("/{id}/solutions")
    public List<SolutionDTO> getSolutionsByProblem(
            @PathVariable Integer id) {
        return problemService.getSolutionsByProblem(id);
    }

    //findall DTO
    @GetMapping("/dto")
    public List<ProblemDTO> getAllDTO() {
        return problemService.findAllDTO();
    }

    //finbyid DTO
    @GetMapping("/dto/{id}")
    public ProblemDTO getByIdDTO(
            @PathVariable Integer id) {
        return problemService.findByIdDTO(id);
    }

}