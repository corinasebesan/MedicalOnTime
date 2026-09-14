package com.medicalontime.springboot.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalontime.springboot.exception.ResourceNotFoundException;
import com.medicalontime.springboot.model.Appointment;
import com.medicalontime.springboot.model.Description;
import com.medicalontime.springboot.model.Patient;
import com.medicalontime.springboot.repository.AppointmentRepository;
import com.medicalontime.springboot.repository.DescriptionRepository;
import com.medicalontime.springboot.security.AccountPrincipal;
import com.medicalontime.springboot.security.AccountService;
import com.medicalontime.springboot.security.CurrentUser;

/**
 * Everything about the caller's own account.
 *
 * These endpoints take no id. The identity comes from the token, so there is no
 * parameter for a client to change in order to read somebody else's record, and
 * the screens that show "my appointments" or "my treatment history" do not need
 * to be trusted to send the right id.
 */
@RestController
@RequestMapping("/api/v1/me")
public class MeController {

	private final CurrentUser currentUser;
	private final AccountService accounts;
	private final AppointmentRepository appointmentRepository;
	private final DescriptionRepository descriptionRepository;

	public MeController(CurrentUser currentUser, AccountService accounts, AppointmentRepository appointmentRepository,
			DescriptionRepository descriptionRepository) {
		this.currentUser = currentUser;
		this.accounts = accounts;
		this.appointmentRepository = appointmentRepository;
		this.descriptionRepository = descriptionRepository;
	}

	@GetMapping
	public ResponseEntity<Object> me() {
		AccountPrincipal account = currentUser.require();
		switch (account.getRole()) {
		case PATIENT:
			return ResponseEntity.ok(accounts.loadPatient(account.getId())
					.orElseThrow(() -> new ResourceNotFoundException("This account no longer exists")));
		case DOCTOR:
			return ResponseEntity.ok(accounts.loadDoctor(account.getId())
					.orElseThrow(() -> new ResourceNotFoundException("This account no longer exists")));
		default:
			return ResponseEntity.ok(accounts.loadAdmin(account.getId())
					.orElseThrow(() -> new ResourceNotFoundException("This account no longer exists")));
		}
	}

	@GetMapping("/appointments")
	public List<Appointment> myAppointments() {
		AccountPrincipal account = currentUser.require();
		switch (account.getRole()) {
		case PATIENT:
			return appointmentRepository.findByIdPatient(account.getId());
		case DOCTOR:
			return appointmentRepository.findByIdDoctor(account.getId());
		default:
			return appointmentRepository.findAll();
		}
	}

	@GetMapping("/descriptions")
	public List<Description> myDescriptions() {
		AccountPrincipal account = currentUser.require();
		switch (account.getRole()) {
		case DOCTOR:
			return descriptionRepository.findByIdDoctor(account.getId());
		case PATIENT:
			// Treatment notes are linked to the patient by name rather than by
			// id in the original schema, so this is a name match. Noted in the
			// README as the next thing worth changing.
			return accounts.loadPatient(account.getId())
					.map(Patient::getName)
					.map(descriptionRepository::findByPatientNameIgnoreCase)
					.orElse(Collections.emptyList());
		default:
			return descriptionRepository.findAll();
		}
	}
}
