// src/main/java/com/authservice/exception/InvalidCredentialsException.java
package com.authservice.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
