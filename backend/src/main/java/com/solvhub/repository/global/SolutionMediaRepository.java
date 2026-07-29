package com.solvhub.repository.global;

import java.util.List;
import com.solvhub.model.SolutionMedia;
import org.springframework.data.jpa.repository.JpaRepository; 

public interface SolutionMediaRepository extends JpaRepository<SolutionMedia, Integer> {

    // Permet de récupérer tous les médias liés à une solution spécifique
    List<SolutionMedia> findBySolution_IdSolution(Integer idSolution);

}
