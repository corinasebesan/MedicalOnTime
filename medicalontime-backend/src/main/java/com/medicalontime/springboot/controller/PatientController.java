package com.medicalontime.springboot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalontime.springboot.exception.BadRequestException;
import com.medicalontime.springboot.exception.ResourceNotFoundException;
import com.medicalontime.springboot.model.Patient;
import com.medicalontime.springboot.repository.PatientRepository;
import com.medicalontime.springboot.security.AccountService;
import com.medicalontime.springboot.security.CurrentUser;
import com.medicalontime.springboot.security.Role;

@RestController
@RequestMapping("/api/v1/")
public class PatientController {

	private final PatientRepository patientRepository;
	private final AccountService accounts;
	private final CurrentUser currentUser;

	public PatientController(PatientRepository patientRepository, AccountService accounts, CurrentUser currentUser) {
		this.patientRepository = patientRepository;
		this.accounts = accounts;
		this.currentUser = currentUser;
	}

	/** Staff only, enforced by the URL rules in SecurityConfig. */
	@GetMapping("/patients")
	public List<Patient> getAllPatients() {
		return patientRepository.findAll();
	}

	/** Creating a patient from here is an admin action. Public sign up goes through /api/v1/auth/register. */
	@PostMapping("/patients")
	public Patient createPatient(@RequestBody Patient patient) {
		if (patient.getUsername() == null || patient.getUsername().trim().isEmpty()) {
			throw new BadRequestException("username is required");
		}
		if (patient.getPassword() == null || patient.getPassword().length() < 8) {
			throw new BadRequestException("password must be at least 8 characters");
		}
		if (accounts.usernameTaken(Role.PATIENT, patient.getUsername().trim())) {
			throw new BadRequestException("That username is already taken");
		}
		patient.setUsername(patient.getUsername().trim());
		patient.setPassword(accounts.hash(patient.getPassword()));
		return patientRepository.save(patient);
	}

	@GetMapping("/patients/{id}")
	public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
		currentUser.requireSelfOr(id, Role.ADMIN, Role.DOCTOR);
		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Patient not exist with id :" + id));
		return ResponseEntity.ok(patient);
	}

	@PutMapping("/patients/{id}")
	public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
		currentUser.requireSelfOr(id, Role.ADMIN);

		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Patient not exist with id :" + id));

		// The username is the login identifier, so it is not editable through
		// the profile form.
		patient.setName(patientDetails.getName());
		patient.setAddress(patientDetails.getAddress());
		patient.setContactNumber(patientDetails.getContactNumber());
		patient.setEmail(patientDetails.getEmail());
		patient.setBloodType(patientDetails.getBloodType());

		// The password is write only, so a client that fetched this record and
		// sent it back has no password field at all. Only touch the stored hash
		// when a new password was actually supplied, otherwise a profile edit
		// would silently wipe it.
		if (patientDetails.getPassword() != null && !patientDetails.getPassword().trim().isEmpty()) {
			if (patientDetails.getPassword().length() < 8) {
				throw new BadRequestException("password must be at least 8 characters");
			}
			patient.setPassword(accounts.hash(patientDetails.getPassword()));
		}

		return ResponseEntity.ok(patientRepository.save(patient));
	}

	@DeleteMapping("/patients/{id}")
	public ResponseEntity<Map<String, Boolean>> deletePatient(@PathVariable Long id) {
		Patient patient = patientRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Patient not exist with id :" + id));

		patientRepository.delete(patient);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}
}
