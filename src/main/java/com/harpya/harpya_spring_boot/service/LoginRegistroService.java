package com.harpya.harpya_spring_boot.service;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harpya.harpya_spring_boot.model.LoginRegistro;
import com.harpya.harpya_spring_boot.repo.LoginRegistroRepo;

@Service
public class LoginRegistroService {
	@Autowired
    private LoginRegistroRepo loginRegistroRepo;

    public void registrarLogin(String nome, String email, String ip, String localizacao) {
        LoginRegistro registro = new LoginRegistro();
        registro.setNome(nome);
        registro.setEmail(email);
        registro.setIp(ip);
        registro.setLocalizacao(localizacao);
        registro.setDataHora(LocalDateTime.now());
        loginRegistroRepo.save(registro);
    }
}
