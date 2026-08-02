package com.solvhub.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Integer idUsers;
    private String username;
    private String email;
    private Long solutionCount;
    private String badge;
    private String role;
    private Boolean emailNotificationsEnabled;
    private Boolean googleAccount;
}
