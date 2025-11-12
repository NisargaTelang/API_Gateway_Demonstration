// src/main/java/com/authservice/service/impl/AuthServiceImpl.java
package com.authservice.service.impl;

import com.authservice.dto.*;
import com.authservice.entity.User;
import com.authservice.enums.Role;
import com.authservice.exception.InvalidCredentialsException;
import com.authservice.exception.UserAlreadyExistsException;
import com.authservice.repository.UserRepository;
import com.authservice.security.JwtUtil;
import com.authservice.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email already exists");
        }

        String hashed = passwordEncoder.encode(request.getPassword());
        Role role = request.getRole() != null ? request.getRole() : Role.USER;

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(hashed);
        user.setMobileNo(request.getMobileNo());
        user.setRole(role);

        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password must be provided");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        // Create claims: include email, role, userId as required
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());

        String token = jwtUtil.generateToken(claims, user.getEmail(), user.getId());

        return new LoginResponse(token, user.getFullName(), user.getEmail(), user.getMobileNo(), user.getRole());
    }
}
