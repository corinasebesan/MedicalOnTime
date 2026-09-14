package com.medicalontime.springboot.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * The authenticated caller, flattened from whichever of the three account
 * tables they came from. Carries the row id as well as the username, because
 * every ownership check in the controllers is an id comparison.
 */
public class AccountPrincipal implements UserDetails {

	private static final long serialVersionUID = 1L;

	private final long id;
	private final String username;
	private final String passwordHash;
	private final Role role;

	public AccountPrincipal(long id, String username, String passwordHash, Role role) {
		this.id = id;
		this.username = username;
		this.passwordHash = passwordHash;
		this.role = role;
	}

	public long getId() {
		return id;
	}

	public Role getRole() {
		return role;
	}

	public boolean hasRole(Role other) {
		return role == other;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority(role.authority()));
	}

	@Override
	public String getPassword() {
		return passwordHash;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
