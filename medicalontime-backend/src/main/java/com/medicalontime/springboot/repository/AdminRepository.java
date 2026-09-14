package com.medicalontime.springboot.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medicalontime.springboot.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

	Optional<Admin> findByAdminUsername(String adminUsername);

	boolean existsByAdminUsername(String adminUsername);
}
