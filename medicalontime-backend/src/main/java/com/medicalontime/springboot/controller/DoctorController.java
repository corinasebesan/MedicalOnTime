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
import com.medicalontime.springboot.model.Doctor;
import com.medicalontime.springboot.repository.DoctorRepository;
import com.medicalontime.springboot.security.AccountService;
import com.medicalontime.springboot.security.CurrentUser;
import com.medicalontime.springboot.security.Role;

@RestController
@RequestMapping("/api/v1/")
public class DoctorController {

	private final DoctorRepository doctorRepository;
	private final AccountService accounts;
	private final CurrentUser currentUser;

	public DoctorController(DoctorRepository doctorRepository, AccountService accounts, CurrentUser currentUser) {
		this.doctorRepository = doctorRepository;
		this.accounts = accounts;
		this.currentUser = currentUser;
	}

	/**
	 * The directory patients search when booking. Readable by anyone signed in;
	 * the password is never serialised, so there is nothing sensitive in it.
	 */
	@GetMapping("/doctors")
	public List<Doctor> getAllDoctors() {
		return doctorRepository.findAll();
	}

	@PostMapping("/doctors")
	public Doctor createDoctor(@RequestBody Doctor doctor) {
		if (doctor.getUsername() == null || doctor.getUsername().trim().isEmpty()) {
			throw new BadRequestException("username is required");
		}
		if (doctor.getPassword() == null || doctor.getPassword().length() < 8) {
			throw new BadRequestException("password must be at least 8 characters");
		}
		if (accounts.usernameTaken(Role.DOCTOR, doctor.getUsername().trim())) {
			throw new BadRequestException("That username is already taken");
		}
		doctor.setUsername(doctor.getUsername().trim());
		doctor.setPassword(accounts.hash(doctor.getPassword()));
		return doctorRepository.save(doctor);
	}

	@GetMapping("/doctors/{id}")
	public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
		Doctor doctor = doctorRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Doctor not exist with id :" + id));
		return ResponseEntity.ok(doctor);
	}

	@PutMapping("/doctors/{id}")
	public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
		currentUser.requireDoctorSelfOr(id, Role.ADMIN);

		Doctor doctor = doctorRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Doctor not exist with id :" + id));

		doctor.setDoctorName(doctorDetails.getDoctorName());
		doctor.setEmail(doctorDetails.getEmail());
		doctor.setAddress(doctorDetails.getAddress());
		doctor.setContactNumber(doctorDetails.getContactNumber());
		doctor.setCategory(doctorDetails.getCategory());

		if (doctorDetails.getPassword() != null && !doctorDetails.getPassword().trim().isEmpty()) {
			if (doctorDetails.getPassword().length() < 8) {
				throw new BadRequestException("password must be at least 8 characters");
			}
			doctor.setPassword(accounts.hash(doctorDetails.getPassword()));
		}

		return ResponseEntity.ok(doctorRepository.save(doctor));
	}

	@DeleteMapping("/doctors/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteDoctor(@PathVariable Long id) {
		Doctor doctor = doctorRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Doctor not exist with id :" + id));

		doctorRepository.delete(doctor);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}
}
