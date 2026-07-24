package com.solvhub.controller.global;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.solvhub.controller.GenericController;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;
import com.solvhub.service.UserService;
import com.solvhub.dto.UserDTO;

@RestController
@RequestMapping("/api/users")
public class UserController extends GenericController<User, Integer> {

    private final UserService userService;

    public UserController(UserRepository repository, UserService userService) {
        super(repository);
        this.userService = userService;
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Integer id, @RequestBody UserDTO userDTO) {
        return userService.update(id, userDTO);
    }

    // --Top contributeur--
    @GetMapping("/top-contributors")
    public ResponseEntity<List<UserDTO>> getTopContributors() {
        List<UserDTO> topContributors = userService.getTopContributors();
        return ResponseEntity.ok(topContributors);
    }

    // Top 3 contributor
    @GetMapping("/top-contributors/top3")
    public List<UserDTO> getTop3Contributors() {
        return userService.getTop3Contributors();
    }
}
