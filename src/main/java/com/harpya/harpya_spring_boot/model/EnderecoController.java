package com.harpya.harpya_spring_boot.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.harpya.harpya_spring_boot.service.EnderecoService;

public class EnderecoController {

	@Autowired
	private EnderecoService servico;

	// Cadastrar novo endereço
	@PostMapping("/enderecos")
	public Endereco InserirEndereco(@RequestBody Endereco e) {
		return servico.InserirEndereco(e);
	}
	
	// Listar endereços
	@GetMapping("/enderecos")
	public List<Endereco> listarEndereco() {
		return servico.ListarEndereco();
	}
	
	// Atualizar endereço
	@GetMapping("/enderecos")
	public void AtualizarEndereco(@RequestBody Endereco e) {
		servico.AtualizarEndereco(e);
	}
	//Deletar Endereço
	@DeleteMapping(("/enderecos/{id}"))
	public void DeletarEndereco(@PathVariable int id) {
		servico.DeletarEndereco(id);
	}
}
