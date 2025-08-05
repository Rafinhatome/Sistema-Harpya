package com.harpya.harpya_spring_boot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harpya.harpya_spring_boot.model.Endereco;
import com.harpya.harpya_spring_boot.repo.EnderecoRepo;

@Service
public class EnderecoService {

	@Autowired
	private EnderecoRepo repo;
	
	
	// Create
	public Endereco InserirEndereco(Endereco e) {
		return repo.save(e);
	}
	
	// Read
	public List<Endereco> ListarEndereco(){
		return repo.findAll();
	}
	
	// Update
	public void AtualizarEndereco(Endereco e) {
		repo.save(e);
	}
	
	// Delete
	public void DeletarEndereco(Integer id) {
		repo.deleteById(id);
	}
}