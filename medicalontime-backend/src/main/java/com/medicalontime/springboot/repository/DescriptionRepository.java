package com.medicalontime.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medicalontime.springboot.model.Description;

@Repository
public interface DescriptionRepository extends JpaRepository<Description, Long> {

	List<Description> findByIdDoctor(long idDoctor);

	List<Description> findByPatientNameIgnoreCase(String patientName);
}
