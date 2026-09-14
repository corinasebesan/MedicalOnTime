package com.medicalontime.springboot.security;

import java.security.SecureRandom;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

import com.medicalontime.springboot.model.Admin;
import com.medicalontime.springboot.repository.AdminRepository;

/**
 * Creates the first admin so there is a way in on a fresh database.
 *
 * Two things this deliberately does not do. It does not run on every start, so
 * restarting no longer piles up duplicate admin rows the way the original did.
 * And it does not ship a default password: if none is configured it generates
 * one, prints it once, and never stores the plain text anywhere.
 */
@Component
public class AdminSeeder implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

	private final AdminRepository adminRepository;
	private final AccountService accounts;
	private final String username;
	private final String configuredPassword;

	public AdminSeeder(AdminRepository adminRepository, AccountService accounts,
			@Value("${app.seed.admin-username:admin}") String username,
			@Value("${app.seed.admin-password:}") String configuredPassword) {
		this.adminRepository = adminRepository;
		this.accounts = accounts;
		this.username = username;
		this.configuredPassword = configuredPassword;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (adminRepository.existsByAdminUsername(username)) {
			return;
		}

		boolean generated = configuredPassword == null || configuredPassword.trim().isEmpty();
		String password = generated ? randomPassword() : configuredPassword;

		adminRepository.save(new Admin(username, accounts.hash(password)));

		if (generated) {
			log.warn("Created the first admin account. Username: {}. Password: {}. "
					+ "This is printed once and is not recoverable. Set ADMIN_PASSWORD to choose your own.",
					username, password);
		} else {
			log.info("Created the first admin account with the configured password. Username: {}", username);
		}
	}

	private String randomPassword() {
		byte[] bytes = new byte[12];
		new SecureRandom().nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}
}
