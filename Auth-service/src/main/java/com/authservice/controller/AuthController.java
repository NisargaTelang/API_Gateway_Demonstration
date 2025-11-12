// src/main/java/com/authservice/controller/AuthController.java
package com.authservice.controller;

import com.authservice.dto.*;
import com.authservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        // Return basic message with 201 Created
        return ResponseEntity.status(201)
                .body(new java.util.HashMap<String, Object>() {{
                    put("message", "User registered successfully");
                }});
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

