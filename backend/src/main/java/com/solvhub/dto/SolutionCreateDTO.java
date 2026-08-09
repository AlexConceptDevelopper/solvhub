package com.solvhub.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolutionCreateDTO {

    private String title;

    private String steps;

    private Integer difficulty;

    private Integer timeMinutes;

    private Integer riskLevel;

    private Integer problemId;

    private String videoUrl;

    private List<MultipartFile> images;
}
