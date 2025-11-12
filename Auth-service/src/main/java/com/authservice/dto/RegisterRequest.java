// src/main/java/com/authservice/dto/RegisterRequest.java
package com.authservice.dto;

import com.authservice.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String mobileNo;
    private Role role;

}
