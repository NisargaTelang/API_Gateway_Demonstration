// src/main/java/com/authservice/exception/UserAlreadyExistsException.java
package com.authservice.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
