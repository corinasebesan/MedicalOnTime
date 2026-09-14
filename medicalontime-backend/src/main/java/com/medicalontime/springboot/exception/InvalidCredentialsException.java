package com.medicalontime.springboot.exception;

/**
 * Deliberately says nothing about which half of the pair was wrong. Rendered as
 * a 401 by ApiExceptionHandler, in the same JSON shape as every other error.
 */
public class InvalidCredentialsException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public InvalidCredentialsException() {
		super("Wrong username or password");
	}
}
