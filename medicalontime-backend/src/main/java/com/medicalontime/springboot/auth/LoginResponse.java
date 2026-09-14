package com.medicalontime.springboot.auth;

public class LoginResponse {

	private final String token;
	private final String role;
	private final long accountId;
	private final String username;
	private final long expiresInMinutes;

	public LoginResponse(String token, String role, long accountId, String username, long expiresInMinutes) {
		this.token = token;
		this.role = role;
		this.accountId = accountId;
		this.username = username;
		this.expiresInMinutes = expiresInMinutes;
	}

	public String getToken() {
		return token;
	}

	public String getRole() {
		return role;
	}

	public long getAccountId() {
		return accountId;
	}

	public String getUsername() {
		return username;
	}

	public long getExpiresInMinutes() {
		return expiresInMinutes;
	}
}
