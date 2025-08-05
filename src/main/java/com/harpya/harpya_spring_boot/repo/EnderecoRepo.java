package com.harpya.harpya_spring_boot.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.harpya.harpya_spring_boot.model.Endereco;

// Remova a 'class EnderecoRepo' e deixe apenas a interface
public interface EnderecoRepo extends JpaRepository<Endereco, Integer> {

}