package com.harpya.harpya_spring_boot.controller;

import com.harpya.harpya_spring_boot.model.Login;
import com.harpya.harpya_spring_boot.repo.LoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/dashboard") // Novo endpoint base
public class DashboardController {

    @Autowired
    private LoginRepo loginRepo;

    @GetMapping("/acessos")
    public List<Login> getAcessosPorMesEAno(
        @RequestParam String mes,
        @RequestParam String ano
    ) {
        return loginRepo.findByMesAndAno(mes, ano);
    }
}