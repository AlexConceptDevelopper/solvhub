package com.solvhub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Integer idUsers;
    private String username;
    private String email;
    private String role;
}
