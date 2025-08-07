package com.harpya.harpya_spring_boot.model;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;

@CrossOrigin
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    @JsonProperty("nomeUsuario")
    @Column(name = "nome")
    private String nomeUsuario;

    @JsonProperty("emailUsuario")
    @Column(name = "email")
    private String emailUsuario;

    @Column(name = "senha")
    private String senha_hash;

    @Column(name = "ativo")
    private int ativo;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_endereco", referencedColumnName = "id")
    private Endereco enderecoUsuario;

    public Usuario() {}

    public Usuario(int id, String nomeUsuario, String emailUsuario, String senha_hash, int ativo, Endereco enderecoUsuario) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.emailUsuario = emailUsuario;
        this.senha_hash = senha_hash;
        this.ativo = ativo;
        this.enderecoUsuario = enderecoUsuario;
    }

    // Getters e Setters

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

    public Endereco getEnderecoUsuario() {
        return enderecoUsuario;
    }

    public void setEnderecoUsuario(Endereco enderecoUsuario) {
        this.enderecoUsuario = enderecoUsuario;
    }
}