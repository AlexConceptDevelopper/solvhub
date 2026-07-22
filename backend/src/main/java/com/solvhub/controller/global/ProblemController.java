package com.solvhub.controller.global;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.solvhub.controller.GenericController;
import com.solvhub.dto.CreateProblemDTO;
import com.solvhub.dto.ProblemDTO;
import com.solvhub.dto.SolutionDTO;
import com.solvhub.exception.InvalidDataException;
import com.solvhub.model.Problem;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.service.ProblemService;

@RestController
@RequestMapping("/api/problems")
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

    @PostMapping
    public ProblemDTO create(
            @RequestBody CreateProblemDTO dto) {

        return problemService.create(dto);
    }

    @Override
    @PostMapping("/legacy")
    public Problem save(Problem entity) {
        throw new InvalidDataException(
                "Utilisez POST /api/problems avec { title, description, idCategory }");
    }

    @PutMapping("/{id}")
    public ProblemDTO update(
            @PathVariable Integer id,
            @RequestBody ProblemDTO dto) {
        return problemService.update(id, dto);
    }
}