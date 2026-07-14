package com.solvhub.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.solvhub.repository.GenericRepository;

@RestController
public abstract class GenericController<T, ID> {
    protected final GenericRepository<T, ID> repository;

    public GenericController(GenericRepository<T, ID> repository) {
        this.repository = repository;
    }

    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    @CrossOrigin
    public Iterable<T> all() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @CrossOrigin
    public Optional<T> get(@PathVariable ID id) {
        return repository.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @CrossOrigin
    public T save(@RequestBody T entity) {
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin
    public ResponseEntity<?> delete(@PathVariable ID id) {
        Optional<T> optionalEntity = repository.findById(id);

        if (optionalEntity.isPresent()) {
            repository.delete(optionalEntity.get());
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }
    
}
