package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.solvhub.dto.VoteCreateDTO;
import com.solvhub.dto.VoteDTO;
import com.solvhub.service.VoteService;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "*")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VoteDTO createVote(
            @RequestBody VoteCreateDTO dto) {
        return voteService.addVote(dto);
    }

    @GetMapping("/solution/{idSolution}")
    public List<VoteDTO> findBySolution(
            @PathVariable Integer idSolution) {

        return voteService.findBySolution(idSolution);
    }

    // check si l'user à déjà voté pour cette solution
    @GetMapping("/check")
    public boolean hasUserVoted(
            @RequestParam Integer solutionId,
            @RequestParam Integer userId) {
        return voteService.hasUserVoted(
                userId,
                solutionId);
    }
}
