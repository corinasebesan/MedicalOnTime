package com.medicalontime.springboot.auth;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalontime.springboot.exception.BadRequestException;
import com.medicalontime.springboot.exception.InvalidCredentialsException;
import com.medicalontime.springboot.model.Patient;
import com.medicalontime.springboot.repository.PatientRepository;
import com.medicalontime.springboot.security.AccountPrincipal;
import com.medicalontime.springboot.security.AccountService;
import com.medicalontime.springboot.security.JwtTokenService;
import com.medicalontime.springboot.security.Role;

/**
 * The only two endpoints that can be called without a token.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final AccountService accounts;
	private final JwtTokenService tokens;
	private final PatientRepository patientRepository;

	public AuthController(AccountService accounts, JwtTokenService tokens, PatientRepository patientRepository) {
		this.accounts = accounts;
		this.tokens = tokens;
		this.patientRepository = patientRepository;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
		Role role = parseRole(request.getRole());

		// One message for an unknown username and for a wrong password. Saying
		// which of the two failed would let anyone enumerate the accounts.
		AccountPrincipal account = accounts
				.authenticate(role, request.getUsername().trim(), request.getPassword())
				.orElseThrow(InvalidCredentialsException::new);

		LoginResponse response = new LoginResponse(tokens.issue(account), account.getRole().name(), account.getId(),
				account.getUsername(), tokens.getTtlMinutes());
		return ResponseEntity.ok(response);
	}

	/**
	 * Public sign up creates patients only. Doctor and admin accounts are
	 * created by an admin, which is what the original sign-up screen implied and
	 * what the authorisation rules now enforce.
	 */
	@PostMapping("/register")
	public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
		String username = request.getUsername().trim();
		if (accounts.usernameTaken(Role.PATIENT, username)) {
			throw new BadRequestException("That username is already taken");
		}

		Patient patient = new Patient(username, request.getName(), request.getAddress(), request.getContactNumber(),
				request.getEmail(), accounts.hash(request.getPassword()), request.getBloodType());
		Patient saved = patientRepository.save(patient);

		AccountPrincipal account = new AccountPrincipal(saved.getId(), saved.getUsername(), saved.getPassword(),
				Role.PATIENT);
		LoginResponse response = new LoginResponse(tokens.issue(account), Role.PATIENT.name(), saved.getId(),
				saved.getUsername(), tokens.getTtlMinutes());
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	private Role parseRole(String value) {
		try {
			return Role.from(value);
		} catch (IllegalArgumentException e) {
			throw new BadRequestException("role must be one of ADMIN, DOCTOR, PATIENT");
		}
	}
}
