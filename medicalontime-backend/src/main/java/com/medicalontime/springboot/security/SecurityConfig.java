package com.medicalontime.springboot.security;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Who may call what.
 *
 * Two layers. The rules here are the ones that depend only on the role and the
 * URL, and they are the coarse gate: a patient cannot reach an admin endpoint
 * at all. The checks that depend on which row is being touched, such as one
 * patient reading another patient's record, cannot be expressed as a URL
 * pattern and live in the controllers through {@link CurrentUser}.
 *
 * The API is stateless. There is no session and no session cookie, so there is
 * nothing for a cross-site request to ride on and CSRF protection is turned
 * off deliberately rather than by oversight.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final JwtTokenService tokenService;
	private final RestAuthenticationHandlers restHandlers;
	private final List<String> allowedOrigins;

	public SecurityConfig(JwtTokenService tokenService, RestAuthenticationHandlers restHandlers,
			@Value("${app.cors.allowed-origins:http://localhost:3000}") String allowedOrigins) {
		this.tokenService = tokenService;
		this.restHandlers = restHandlers;
		this.allowedOrigins = Arrays.asList(allowedOrigins.split("\\s*,\\s*"));
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.cors().and()
			.csrf().disable()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
			.exceptionHandling()
				.authenticationEntryPoint(restHandlers)
				.accessDeniedHandler(restHandlers)
				.and()
			.authorizeRequests()
				.antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.antMatchers("/api/v1/auth/**").permitAll()

				// Anything about the caller's own records. The controller reads
				// the identity from the token, so there is no id to tamper with.
				.antMatchers("/api/v1/me/**").authenticated()

				.antMatchers("/api/v1/admins/**").hasRole("ADMIN")

				// The directory of doctors is readable by anyone signed in,
				// because patients search it to book. Adding and removing
				// doctors is the admin's job. A doctor may edit their own
				// profile, which the controller checks by id.
				.antMatchers(HttpMethod.GET, "/api/v1/doctors/**").authenticated()
				.antMatchers(HttpMethod.PUT, "/api/v1/doctors/**").authenticated()
				.antMatchers(HttpMethod.POST, "/api/v1/doctors/**").hasRole("ADMIN")
				.antMatchers(HttpMethod.DELETE, "/api/v1/doctors/**").hasRole("ADMIN")

				// Listing every patient is a staff action. Reading or editing a
				// single patient is also allowed for the patient themselves,
				// which the controller checks by id.
				.antMatchers(HttpMethod.GET, "/api/v1/patients").hasAnyRole("ADMIN", "DOCTOR")
				.antMatchers(HttpMethod.POST, "/api/v1/patients/**").hasRole("ADMIN")
				.antMatchers(HttpMethod.DELETE, "/api/v1/patients/**").hasRole("ADMIN")
				.antMatchers("/api/v1/patients/**").authenticated()

				// Listing every appointment in the system is a staff action. A
				// patient sees their own through /api/v1/me/appointments, and
				// booking or cancelling a single one is checked by id.
				.antMatchers(HttpMethod.GET, "/api/v1/appointments").hasAnyRole("ADMIN", "DOCTOR")
				.antMatchers("/api/v1/appointments/**").authenticated()

				// Treatment notes are written by doctors. A patient reads their
				// own through /api/v1/me/descriptions.
				.antMatchers(HttpMethod.GET, "/api/v1/descriptions/**").hasAnyRole("ADMIN", "DOCTOR")
				.antMatchers(HttpMethod.POST, "/api/v1/descriptions/**").hasRole("DOCTOR")
				.antMatchers(HttpMethod.PUT, "/api/v1/descriptions/**").hasRole("DOCTOR")
				.antMatchers(HttpMethod.DELETE, "/api/v1/descriptions/**").hasAnyRole("ADMIN", "DOCTOR")

				.anyRequest().authenticated()
				.and()
			.httpBasic().disable()
			.formLogin().disable();

		http.addFilterBefore(new JwtAuthenticationFilter(tokenService), UsernamePasswordAuthenticationFilter.class);
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(allowedOrigins);
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
		config.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", config);
		return source;
	}
}
