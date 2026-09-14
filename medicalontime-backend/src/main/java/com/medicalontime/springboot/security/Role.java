package com.medicalontime.springboot.security;

/**
 * The three kinds of account the system knows about. Each one lives in its own
 * table, which is why a login request has to say which role it is for: the same
 * username could exist as both a patient and a doctor.
 */
public enum Role {

	ADMIN, DOCTOR, PATIENT;

	/** Spring Security expects authorities to carry the ROLE_ prefix. */
	public String authority() {
		return "ROLE_" + name();
	}

	public static Role from(String value) {
		if (value == null) {
			throw new IllegalArgumentException("Role is required");
		}
		return Role.valueOf(value.trim().toUpperCase());
	}
}
