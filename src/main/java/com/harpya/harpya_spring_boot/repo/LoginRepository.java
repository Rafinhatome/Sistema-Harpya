package com.harpya.harpya_spring_boot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.harpya.harpya_spring_boot.service.LoginRegistro;

@Repository
public interface LoginRepository extends JpaRepository<LoginRegistro, Integer> {
}
