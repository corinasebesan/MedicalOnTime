package com.medicalontime.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medicalontime.springboot.model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

	List<Appointment> findByIdPatient(long idPatient);

	List<Appointment> findByIdDoctor(long idDoctor);
}
