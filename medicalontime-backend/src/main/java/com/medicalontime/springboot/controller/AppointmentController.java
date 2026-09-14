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
import com.medicalontime.springboot.model.Appointment;
import com.medicalontime.springboot.repository.AppointmentRepository;
import com.medicalontime.springboot.repository.DoctorRepository;
import com.medicalontime.springboot.security.AccountPrincipal;
import com.medicalontime.springboot.security.CurrentUser;
import com.medicalontime.springboot.security.Role;

@RestController
@RequestMapping("/api/v1/")
public class AppointmentController {

	private final AppointmentRepository appointmentRepository;
	private final DoctorRepository doctorRepository;
	private final CurrentUser currentUser;

	public AppointmentController(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository,
			CurrentUser currentUser) {
		this.appointmentRepository = appointmentRepository;
		this.doctorRepository = doctorRepository;
		this.currentUser = currentUser;
	}

	/** Staff only, enforced by the URL rules. Patients use /api/v1/me/appointments. */
	@GetMapping("/appointments")
	public List<Appointment> getAllAppointments() {
		return appointmentRepository.findAll();
	}

	/**
	 * A patient books for themselves. The patient id is taken from the token
	 * rather than from the body, so booking in somebody else's name is not a
	 * request a client can make.
	 */
	@PostMapping("/appointments")
	public Appointment createAppointment(@RequestBody Appointment appointment) {
		AccountPrincipal account = currentUser.require();

		if (account.hasRole(Role.PATIENT)) {
			appointment.setIdPatient(account.getId());
		} else if (!account.hasRole(Role.ADMIN)) {
			throw new ForbiddenException("Only a patient or an admin can create an appointment");
		}

		if (!doctorRepository.existsById(appointment.getIdDoctor())) {
			throw new BadRequestException("No doctor with id " + appointment.getIdDoctor());
		}
		if (appointment.getDate() == null || appointment.getDate().trim().isEmpty()) {
			throw new BadRequestException("date is required");
		}
		if (appointment.getTime() == null || appointment.getTime().trim().isEmpty()) {
			throw new BadRequestException("time is required");
		}

		appointment.setId(0);
		return appointmentRepository.save(appointment);
	}

	@GetMapping("/appointments/{id}")
	public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
		Appointment appointment = load(id);
		requireParticipant(appointment);
		return ResponseEntity.ok(appointment);
	}

	@PutMapping("/appointments/{id}")
	public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id,
			@RequestBody Appointment appointmentDetails) {
		Appointment appointment = load(id);
		requireParticipant(appointment);

		appointment.setDate(appointmentDetails.getDate());
		appointment.setTime(appointmentDetails.getTime());

		// Who the appointment is between is not something rescheduling may
		// change. Moving it to a different patient would be a way to read or
		// delete somebody else's booking a moment later.
		if (currentUser.is(Role.ADMIN)) {
			appointment.setIdPatient(appointmentDetails.getIdPatient());
			appointment.setIdDoctor(appointmentDetails.getIdDoctor());
		}

		return ResponseEntity.ok(appointmentRepository.save(appointment));
	}

	@DeleteMapping("/appointments/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteAppointment(@PathVariable Long id) {
		Appointment appointment = load(id);
		requireParticipant(appointment);

		appointmentRepository.delete(appointment);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

	private Appointment load(Long id) {
		return appointmentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Appointment not exist with id :" + id));
	}

	/** An admin, or the patient or doctor the appointment is actually between. */
	private void requireParticipant(Appointment appointment) {
		AccountPrincipal account = currentUser.require();
		if (account.hasRole(Role.ADMIN)) {
			return;
		}
		if (account.hasRole(Role.PATIENT) && account.getId() == appointment.getIdPatient()) {
			return;
		}
		if (account.hasRole(Role.DOCTOR) && account.getId() == appointment.getIdDoctor()) {
			return;
		}
		throw new ForbiddenException("This appointment belongs to another account");
	}
}
