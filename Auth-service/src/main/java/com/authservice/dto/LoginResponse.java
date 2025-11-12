// src/main/java/com/authservice/dto/LoginResponseUserDTO.java
package com.authservice.dto;

import com.authservice.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class LoginResponse {
	private String token;
	private String fullName;
	private String email;
	private String mobileNo;
	private Role role;

}
