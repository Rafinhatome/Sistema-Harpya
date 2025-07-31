package com.harpya.harpya_spring_boot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harpya.harpya_spring_boot.model.Usuario;

public interface UsuarioRepo extends JpaRepository<Usuario, Integer> {

	
}
