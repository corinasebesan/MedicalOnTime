package com.medicalontime.springboot.auth;

import javax.validation.constraints.NotBlank;

public class LoginRequest {

	@NotBlank(message = "is required")
	private String role;

	@NotBlank(message = "is required")
	private String username;

	@NotBlank(message = "is required")
	private String password;

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
