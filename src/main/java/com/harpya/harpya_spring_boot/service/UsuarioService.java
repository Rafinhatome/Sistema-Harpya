package com.harpya.harpya_spring_boot.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harpya.harpya_spring_boot.model.Usuario;
import com.harpya.harpya_spring_boot.repo.UsuarioRepo;

@Service
public class UsuarioService {
	
	@Autowired
	UsuarioRepo repo;
	
	// Create
	public Usuario InserirUsuario(Usuario u) {
	    return repo.save(u);
	}
	
	// Read
	public List<Usuario> listarUsuario() {
		return repo.findAll();
	}
	
	
	// Update
	public void atualizarUsuario(Usuario u) {
		repo.save(u);
	}
	
	
	// Delete
	public void deletarUsuario(int id) {
		repo.deleteById(id);
	}
}
