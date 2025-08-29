package com.harpya.harpya_spring_boot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FacialService {

    @Autowired
    private RestTemplate restTemplate;

    private final String PYTHON_SERVICE_URL = "http://localhost:5000";

    public boolean cadastrarRosto(String idUsuario, String imagemBase64) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String jsonPayload = "{\"imagem\": \"" + imagemBase64 + "\"}";
        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

        String url = PYTHON_SERVICE_URL + "/cadastro-facial/" + idUsuario;

        try {
            restTemplate.postForEntity(url, entity, String.class);
            return true; // Rosto cadastrado com sucesso
        } catch (Exception e) {
            System.err.println("Erro ao chamar o serviço Python: " + e.getMessage());
            return false; // Falha no cadastro
        }
    }

    public String loginFacial(String imagemBase64) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String jsonPayload = "{\"imagem\": \"" + imagemBase64 + "\"}";
        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

        String url = PYTHON_SERVICE_URL + "/login-facial";

        try {
            // A resposta do Python será o ID do usuário se o login for bem-sucedido
            return restTemplate.postForObject(url, entity, String.class);
        } catch (Exception e) {
            System.err.println("Erro ao chamar o serviço Python: " + e.getMessage());
            return null; // Login falhou
        }
        
        
    }
}
