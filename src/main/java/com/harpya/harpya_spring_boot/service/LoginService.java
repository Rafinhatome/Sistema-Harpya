package com.harpya.harpya_spring_boot.service;

import com.harpya.harpya_spring_boot.model.Login;
import com.harpya.harpya_spring_boot.repo.LoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LoginService {

    @Autowired
    private LoginRepo loginRepo;

    @Autowired
    private GeoIpService geoIpService;

    public void registrarLogin(
        long idUsuario,
        String nome,
        String email,
        String ip
    ) {
        // Obtém a localização usando o serviço de IP
        String localizacao = geoIpService.getLocalizationByIp(ip);

        // Cria e preenche o objeto Login
        Login login = new Login();
        login.setIdUsuario(idUsuario);
        login.setNome(nome);
        login.setEmail(email);
        login.setIp(ip);
        login.setLocalizacao(localizacao);
        login.setDataHora(LocalDateTime.now());

        // Salva no banco de dados
        loginRepo.save(login);
    }
}