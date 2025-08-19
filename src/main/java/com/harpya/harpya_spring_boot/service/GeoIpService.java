package com.harpya.harpya_spring_boot.service;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeoIpService {

    public String getLocalizationByIp(String ip) {
        if (ip == null || ip.equals("0:0:0:0:0:0:0:1") || ip.equals("127.0.0.1")) {
            return "Localização desconhecida (IP local)";
        }

        String apiUrl = "https://ipinfo.io/" + ip + "/json";
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            String jsonResponse = restTemplate.getForObject(apiUrl, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            
            String city = root.path("city").asText();
            String region = root.path("region").asText();
            String country = root.path("country").asText();

            if (!city.isEmpty() && !country.isEmpty()) {
                return city + ", " + country;
            } else {
                return "Localização desconhecida";
            }
            
        } catch (Exception e) {
            System.err.println("Erro ao buscar localização para o IP " + ip + ": " + e.getMessage());
            return "Localização desconhecida (Erro na API)";
        }
    }
}
