package com.medicalontime.springboot.security;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.medicalontime.springboot.model.Admin;
import com.medicalontime.springboot.model.Doctor;
import com.medicalontime.springboot.model.Patient;
import com.medicalontime.springboot.repository.AdminRepository;
import com.medicalontime.springboot.repository.DoctorRepository;
import com.medicalontime.springboot.repository.PatientRepository;

/**
 * Looks an account up in the right table for its role and checks the password
 * against the stored hash.
 *
 * Three tables rather than one users table is inherited from the original data
 * model. The cost is this class; the alternative was a migration that would
 * have touched every controller, and the tables are what the assignment
 * documents describe.
 */
@Service
public class AccountService {

	private final AdminRepository adminRepository;
	private final DoctorRepository doctorRepository;
	private final PatientRepository patientRepository;
	private final PasswordEncoder passwordEncoder;

	public AccountService(AdminRepository adminRepository, DoctorRepository doctorRepository,
			PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
		this.adminRepository = adminRepository;
		this.doctorRepository = doctorRepository;
		this.patientRepository = patientRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Optional<AccountPrincipal> find(Role role, String username) {
		if (username == null) {
			return Optional.empty();
		}
		switch (role) {
		case ADMIN:
			return adminRepository.findByAdminUsername(username)
					.map(a -> new AccountPrincipal(a.getId(), a.getAdminUsername(), a.getAdminPassword(), Role.ADMIN));
		case DOCTOR:
			return doctorRepository.findByUsername(username)
					.map(d -> new AccountPrincipal(d.getId(), d.getUsername(), d.getPassword(), Role.DOCTOR));
		case PATIENT:
			return patientRepository.findByUsername(username)
					.map(p -> new AccountPrincipal(p.getId(), p.getUsername(), p.getPassword(), Role.PATIENT));
		default:
			return Optional.empty();
		}
	}

	/**
	 * Verifies a username and password pair. Returns empty for both an unknown
	 * username and a wrong password, and runs the hash comparison in both cases,
	 * so the response does not tell an attacker which usernames exist.
	 */
	public Optional<AccountPrincipal> authenticate(Role role, String username, String rawPassword) {
		Optional<AccountPrincipal> account = find(role, username);
		if (!account.isPresent()) {
			passwordEncoder.matches(rawPassword == null ? "" : rawPassword, DUMMY_HASH);
			return Optional.empty();
		}
		AccountPrincipal principal = account.get();
		if (rawPassword == null || !passwordEncoder.matches(rawPassword, principal.getPassword())) {
			return Optional.empty();
		}
		return Optional.of(principal);
	}

	public String hash(String rawPassword) {
		return passwordEncoder.encode(rawPassword);
	}

	public boolean usernameTaken(Role role, String username) {
		switch (role) {
		case ADMIN:
			return adminRepository.existsByAdminUsername(username);
		case DOCTOR:
			return doctorRepository.existsByUsername(username);
		case PATIENT:
			return patientRepository.existsByUsername(username);
		default:
			return false;
		}
	}

	public Optional<Admin> loadAdmin(long id) {
		return adminRepository.findById(id);
	}

	public Optional<Doctor> loadDoctor(long id) {
		return doctorRepository.findById(id);
	}

	public Optional<Patient> loadPatient(long id) {
		return patientRepository.findById(id);
	}

	/**
	 * A valid BCrypt hash of a value nobody knows, used only to spend the same
	 * amount of time on an unknown username as on a known one.
	 */
	private static final String DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
}
