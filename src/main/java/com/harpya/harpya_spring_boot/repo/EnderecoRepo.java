package com.harpya.harpya_spring_boot.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harpya.harpya_spring_boot.model.Endereco;

// Remova a 'class EnderecoRepo' e deixe apenas a interface
public interface EnderecoRepo extends JpaRepository<Endereco, Integer> {
	Optional<Endereco> findByUsuarioId(int usuarioId);
}