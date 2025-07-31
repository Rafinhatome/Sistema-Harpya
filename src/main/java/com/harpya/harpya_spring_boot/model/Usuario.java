package com.harpya.harpya_spring_boot.model;

import org.springframework.web.bind.annotation.CrossOrigin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@CrossOrigin
@Entity
@Table(name="usuarios")
public class Usuario {

	@Id
	@Column(name="id")
	private int id;
	
	@Column(name="nome")
	private String nomeUsuario;
	
	@Column(name="email")
	private String emailUsuario;
	
	@Column(name="senha")
	private String senha_hash;
	
	@Column(name="ativo")
	private int ativo;
	
	
	public Usuario() {
		
	}
	
	public Usuario(int id, String nomeUsuario, String emailUsuario, String senha_hash, int ativo ) {
		this.id = id;
	

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNomeUsuario() {
		return nomeUsuario;
	}

	public void setNomeUsuario(String nomeUsuario) {
		this.nomeUsuario = nomeUsuario;
	}

	public String getEmailUsuario() {
		return emailUsuario;
	}

	public void setEmailUsuario(String emailUsuario) {
		this.emailUsuario = emailUsuario;
	}

	public String getSenha_hash() {
		return senha_hash;
	}

	public void setSenha_hash(String senha_hash) {
		this.senha_hash = senha_hash;
	}

	public int getAtivo() {
		return ativo;
	}

	public void setAtivo(int ativo) {
		this.ativo = ativo;
	}
	
	
}
