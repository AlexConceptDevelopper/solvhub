package com.solvhub.mapper;

import com.solvhub.dto.SolutionMediaDTO;
import com.solvhub.model.SolutionMedia;

public class SolutionMediaMapper {

    public static SolutionMediaDTO toDto(SolutionMedia media) {
        if (media == null) {
            return null;
        }
        return new SolutionMediaDTO(
            media.getId() != null ? media.getId().intValue() : null, 
            media.getUrl(),
            media.getType()
        );
    }
}
