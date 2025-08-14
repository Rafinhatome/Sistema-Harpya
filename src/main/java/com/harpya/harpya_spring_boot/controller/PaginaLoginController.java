package com.harpya.harpya_spring_boot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginaLoginController {

    @GetMapping("/login")
    public String loginPage() {
        // Servirá o arquivo static/html/login.html
        return "forward:/html/login.html";
    }
}
