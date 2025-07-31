package com.harpya.harpya_spring_boot.model;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.harpya.harpya_spring_boot.service.UsuarioService;

@RestController
@CrossOrigin
public class UsuarioController {

	@Autowired
	UsuarioService servico;
	
	// Create
	@PostMapping("/usuarios")
	public Usuario inserirUsuario(@RequestBody Usuario u) {
	    return servico.InserirUsuario(u);
	}
	
	// Read
	@GetMapping("/usuarios")
	public List<Usuario> listarUsuario() {
		return servico.listarUsuario();
	}
	
	// Update
	@PutMapping("/usuarios")
	public void atualizarUsuario(@RequestBody Usuario u) {
		servico.atualizarUsuario(u);
		
	}
	
	// Delete
	@DeleteMapping("/usuarios/{id}")
	public void deletarUsuario(@PathVariable int id) {
		servico.deletarUsuario(id);
		
	}
	
}
