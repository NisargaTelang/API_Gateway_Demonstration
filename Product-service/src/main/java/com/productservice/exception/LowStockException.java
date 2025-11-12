package com.productservice.exception;

public class LowStockException extends RuntimeException {
    public LowStockException(String message) { super(message); }
}
