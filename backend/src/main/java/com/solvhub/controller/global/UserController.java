package com.solvhub.controller.global;

import org.springframework.web.bind.annotation.*;

import com.solvhub.controller.GenericController;
import com.solvhub.model.User;
import com.solvhub.repository.global.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController extends GenericController<User, Integer> {

    public UserController(UserRepository repository) {
        super(repository);
    }
}
