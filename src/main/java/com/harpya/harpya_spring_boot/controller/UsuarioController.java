package com.harpya.harpya_spring_boot.controller;

import com.harpya.harpya_spring_boot.model.Usuario;
import com.harpya.harpya_spring_boot.service.LoginService;
import com.harpya.harpya_spring_boot.service.UsuarioService;
import com.harpya.harpya_spring_boot.service.reconhecimentoFacialService;
import com.harpya.harpya_spring_boot.service.GeoIpService; // Importe o novo serviço

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService servico;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LoginService loginService;

    @Autowired
    private reconhecimentoFacialService reconhecimentoFacialService;
    
    @Autowired
    private GeoIpService geoIpService; // Injete o serviço de geolocalização

    // -------------------- LOGIN VIA JSON --------------------
    @PostMapping("/html/login")
    public ResponseEntity<String> login(@RequestBody Usuario loginData, HttpServletRequest request) {
        try {
            if (loginData.getEmailUsuario() == null || loginData.getEmailUsuario().isBlank() ||
                loginData.getSenha_hash() == null || loginData.getSenha_hash().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Email e senha são obrigatórios.");
            }

            Usuario usuario = servico.buscarPorEmail(loginData.getEmailUsuario());

            if (usuario != null && passwordEncoder.matches(loginData.getSenha_hash(), usuario.getSenha_hash())) {

                // Captura o IP do usuário
                String ip = request.getHeader("X-Forwarded-For");
                if (ip == null || ip.isEmpty()) {
                    ip = request.getRemoteAddr();
                }

                // Delega o registro do login ao LoginService, passando o IP
                loginService.registrarLogin(
                    usuario.getId(),
                    usuario.getNomeUsuario(),
                    usuario.getEmailUsuario(),
                    ip
                );

                return ResponseEntity.ok("Login realizado com sucesso!");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Email ou senha inválidos.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno: " + e.getMessage());
        }
    }

    // -------------------- CRUD DE USUÁRIOS --------------------
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable int id) {
        Usuario usuario = servico.buscarUsuarioPorId(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<Usuario> inserirUsuario(@RequestBody Usuario u, HttpServletRequest request) {
        // Captura o IP do usuário
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }

        // Busca a localização usando o serviço de IP
        String localizacao = geoIpService.getLocalizationByIp(ip);
        
        // Chama o serviço para inserir o usuário com IP e localização
        Usuario novoUsuario = servico.InserirUsuario(u, ip, localizacao);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
    }

    @GetMapping
    public List<Usuario> listarUsuario() {
        return servico.listarUsuario();
    }

    @PutMapping
    public void atualizarUsuario(@RequestBody Usuario u) {
        servico.atualizarUsuario(u);
    }

    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable int id) {
        servico.deletarUsuario(id);
    }

    // -------------------- RECONHECIMENTO FACIAL --------------------
    @PostMapping("/cadastro-facial/{idUsuario}")
    public ResponseEntity<String> cadastrarRosto(@PathVariable String idUsuario,
                                                 @RequestBody Map<String, String> payload) {
        String imagemBase64 = payload.get("imagem");
        boolean sucesso = reconhecimentoFacialService.cadastrarRosto(idUsuario, imagemBase64);
        if (sucesso) {
            return ResponseEntity.ok("Rosto cadastrado com sucesso!");
        } else {
            return ResponseEntity.badRequest().body("Falha ao cadastrar o rosto.");
        }
    }

    @PostMapping("/login-facial")
    public ResponseEntity<String> loginFacial(@RequestBody Map<String, String> payload) {
        String imagemBase64 = payload.get("imagem");
        String idUsuario = reconhecimentoFacialService.loginFacial(imagemBase64);
        if (idUsuario != null) {
            return ResponseEntity.ok("Login bem-sucedido para o usuário ID: " + idUsuario);
        } else {
            return ResponseEntity.status(401).body("Rosto não reconhecido.");
        }
    }
}