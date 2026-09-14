package com.medicalontime.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicalontime.springboot.exception.ForbiddenException;
import com.medicalontime.springboot.exception.ResourceNotFoundException;
import com.medicalontime.springboot.model.Admin;
import com.medicalontime.springboot.repository.AdminRepository;
import com.medicalontime.springboot.security.AccountPrincipal;
import com.medicalontime.springboot.security.CurrentUser;

@RestController
@RequestMapping("/api/v1/")
public class AdminController {

	private final AdminRepository adminRepository;
	private final CurrentUser currentUser;

	public AdminController(AdminRepository adminRepository, CurrentUser currentUser) {
		this.adminRepository = adminRepository;
		this.currentUser = currentUser;
	}

	/**
	 * Reachable only by an admin, and only for their own row. There is no
	 * endpoint that lists admins, because nothing in the application needs one.
	 */
	@GetMapping("/admins/{id}")
	public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
		AccountPrincipal account = currentUser.require();
		if (account.getId() != id) {
			throw new ForbiddenException("This record belongs to another account");
		}
		Admin admin = adminRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Admin not exist with id :" + id));
		return ResponseEntity.ok(admin);
	}
}
