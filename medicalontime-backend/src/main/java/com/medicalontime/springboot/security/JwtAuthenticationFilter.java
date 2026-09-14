package com.medicalontime.springboot.security;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Reads the bearer token off each request and, if it verifies, puts the caller
 * into the security context for the rest of the request.
 *
 * A missing or bad token is not an error here. The filter simply leaves the
 * context empty and lets the authorisation rules decide whether the endpoint
 * needed a caller at all.
 *
 * Deliberately not a bean. Spring Boot registers any Filter bean in the main
 * servlet chain as well as the security chain, so it would run twice and in
 * the wrong order. SecurityConfig constructs it instead.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String HEADER = "Authorization";
	private static final String PREFIX = "Bearer ";

	private final JwtTokenService tokenService;

	public JwtAuthenticationFilter(JwtTokenService tokenService) {
		this.tokenService = tokenService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		if (SecurityContextHolder.getContext().getAuthentication() == null) {
			bearerToken(request)
					.flatMap(tokenService::verify)
					.ifPresent(account -> {
						UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
								account, null, account.getAuthorities());
						authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
						SecurityContextHolder.getContext().setAuthentication(authentication);
					});
		}

		chain.doFilter(request, response);
	}

	private Optional<String> bearerToken(HttpServletRequest request) {
		String header = request.getHeader(HEADER);
		if (header == null || !header.startsWith(PREFIX)) {
			return Optional.empty();
		}
		String value = header.substring(PREFIX.length()).trim();
		return value.isEmpty() ? Optional.empty() : Optional.of(value);
	}
}
