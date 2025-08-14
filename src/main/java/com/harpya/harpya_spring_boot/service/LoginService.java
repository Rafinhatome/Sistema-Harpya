package com.harpya.harpya_spring_boot.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.harpya.harpya_spring_boot.model.Usuario;
import com.harpya.harpya_spring_boot.repo.LoginRepo;
import com.harpya.harpya_spring_boot.model.Login;

@Service
public class LoginService {

    @Autowired
    private LoginRepo loginRepo;

    /**
     * Registra um login no banco.
     * 
     * @param idUsuario  ID do usuário que realizou o login
     * @param nome       Nome do usuário
     * @param email      Email do usuário
     * @param ip         IP de onde o login foi realizado
     * @param localizacao Localização do login (pode ser "desconhecida")
     */
    public void registrarLogin(int idUsuario, String nome, String email, String ip, String localizacao) {
        Login login = new Login();
        login.setIdUsuario(idUsuario); // id do usuário
        login.setNome(nome);
        login.setEmail(email);
        login.setIp(ip);
        login.setLocalizacao(localizacao);
        login.setDataHora(LocalDateTime.now());

        loginRepo.save(login);
    }
}
