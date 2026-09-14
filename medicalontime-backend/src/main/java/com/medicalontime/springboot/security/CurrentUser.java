package com.medicalontime.springboot.security;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.medicalontime.springboot.exception.ForbiddenException;

/**
 * Access to the authenticated caller, plus the ownership checks the URL rules
 * cannot express.
 *
 * Spring Security can say "only a doctor may call this". It cannot say "only
 * this patient may read this patient", because that depends on the row being
 * asked for. Those checks live here so every controller spells them the same
 * way.
 */
@Component
public class CurrentUser {

	public Optional<AccountPrincipal> account() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof AccountPrincipal)) {
			return Optional.empty();
		}
		return Optional.of((AccountPrincipal) authentication.getPrincipal());
	}

	public AccountPrincipal require() {
		return account().orElseThrow(() -> new ForbiddenException("Not signed in"));
	}

	public boolean is(Role role) {
		return account().map(a -> a.hasRole(role)).orElse(false);
	}

	/**
	 * Allows the call when the caller holds one of the listed roles, or when the
	 * caller is the patient whose record is being touched.
	 */
	public void requireSelfOr(long patientId, Role... rolesAllowed) {
		AccountPrincipal account = require();
		for (Role allowed : rolesAllowed) {
			if (account.hasRole(allowed)) {
				return;
			}
		}
		if (account.hasRole(Role.PATIENT) && account.getId() == patientId) {
			return;
		}
		throw new ForbiddenException("This record belongs to another account");
	}

	public void requireDoctorSelfOr(long doctorId, Role... rolesAllowed) {
		AccountPrincipal account = require();
		for (Role allowed : rolesAllowed) {
			if (account.hasRole(allowed)) {
				return;
			}
		}
		if (account.hasRole(Role.DOCTOR) && account.getId() == doctorId) {
			return;
		}
		throw new ForbiddenException("This record belongs to another account");
	}
}
