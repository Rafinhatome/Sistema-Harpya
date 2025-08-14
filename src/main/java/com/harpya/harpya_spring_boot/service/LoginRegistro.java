package com.harpya.harpya_spring_boot.service;
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

    @Column(name = "id_usuario")
    private int idUsuario;

    public LoginRegistro() {}

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }
}