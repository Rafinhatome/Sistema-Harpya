package com.harpya.harpya_spring_boot.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_registro")
public class LoginRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    private String email;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    private String ip;

    private String localizacao;

    // Construtores, getters e setters

    public LoginRegistro() {}

    public LoginRegistro(String nome, String email, LocalDateTime dataHora, String ip, String localizacao) {
        this.nome = nome;
        this.email = email;
        this.dataHora = dataHora;
        this.ip = ip;
        this.localizacao = localizacao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}
