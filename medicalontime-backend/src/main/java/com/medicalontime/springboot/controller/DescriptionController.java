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
import com.medicalontime.springboot.exception.ForbiddenException;
import com.medicalontime.springboot.exception.ResourceNotFoundException;
import com.medicalontime.springboot.model.Description;
import com.medicalontime.springboot.repository.DescriptionRepository;
import com.medicalontime.springboot.security.AccountPrincipal;
import com.medicalontime.springboot.security.CurrentUser;
import com.medicalontime.springboot.security.Role;

@RestController
@RequestMapping("/api/v1/")
public class DescriptionController {

	private final DescriptionRepository descriptionRepository;
	private final CurrentUser currentUser;

	public DescriptionController(DescriptionRepository descriptionRepository, CurrentUser currentUser) {
		this.descriptionRepository = descriptionRepository;
		this.currentUser = currentUser;
	}

	/** Staff only. A patient reads their own notes through /api/v1/me/descriptions. */
	@GetMapping("/descriptions")
	public List<Description> getAllDescriptions() {
		return descriptionRepository.findAll();
	}

	/**
	 * The author is taken from the token, so a note cannot be filed under
	 * another doctor's name.
	 */
	@PostMapping("/descriptions")
	public Description createDescription(@RequestBody Description description) {
		AccountPrincipal account = currentUser.require();
		if (description.getPatientName() == null || description.getPatientName().trim().isEmpty()) {
			throw new BadRequestException("patientName is required");
		}
		description.setIdDoctor(account.getId());
		description.setId(0);
		return descriptionRepository.save(description);
	}

	@GetMapping("/descriptions/{id}")
	public ResponseEntity<Description> getDescriptionById(@PathVariable Long id) {
		return ResponseEntity.ok(load(id));
	}

	@PutMapping("/descriptions/{id}")
	public ResponseEntity<Description> updateDescription(@PathVariable Long id,
			@RequestBody Description descriptionDetails) {
		Description description = load(id);
		requireAuthor(description);

		description.setPatientName(descriptionDetails.getPatientName());
		description.setTreatment(descriptionDetails.getTreatment());
		description.setNote(descriptionDetails.getNote());

		return ResponseEntity.ok(descriptionRepository.save(description));
	}

	@DeleteMapping("/descriptions/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteDescription(@PathVariable Long id) {
		Description description = load(id);
		requireAuthor(description);

		descriptionRepository.delete(description);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

	private Description load(Long id) {
		return descriptionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Description not exist with id :" + id));
	}

	/** A doctor may only change notes they wrote. An admin may change any. */
	private void requireAuthor(Description description) {
		AccountPrincipal account = currentUser.require();
		if (account.hasRole(Role.ADMIN)) {
			return;
		}
		if (account.hasRole(Role.DOCTOR) && account.getId() == description.getIdDoctor()) {
			return;
		}
		throw new ForbiddenException("This note was written by another doctor");
	}
}
