package com.harpya.harpya_spring_boot.model;

import com.harpya.harpya_spring_boot.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
// @RequestMapping("/api") // opcional para organizar as rotas
@CrossOrigin
public class UsuarioController {

    @Autowired
    private UsuarioService servico;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
  
    // Endpoint de login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Usuario loginData) {
        // Validação de campos obrigatórios
        if (loginData.getEmailUsuario() == null || loginData.getEmailUsuario().isBlank() ||
            loginData.getSenha_hash() == null || loginData.getSenha_hash().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email e senha são obrigatórios.");
        }

        Usuario usuario = servico.buscarPorEmail(loginData.getEmailUsuario());

        if (usuario != null && passwordEncoder.matches(loginData.getSenha_hash(), usuario.getSenha_hash())) {
            return ResponseEntity.ok("Login realizado com sucesso!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos.");
        }
    }

    // Cadastro de novo usuário
    @PostMapping("/usuarios")
    public Usuario inserirUsuario(@RequestBody Usuario u) {
        return servico.InserirUsuario(u);
    }

    // Listar usuários
    @GetMapping("/usuarios")
    public List<Usuario> listarUsuario() {
        return servico.listarUsuario();
    }

    // Atualizar usuário
    @PutMapping("/usuarios")
    public void atualizarUsuario(@RequestBody Usuario u) {
        servico.atualizarUsuario(u);
    }

    // Deletar usuário
    @DeleteMapping("/usuarios/{id}")
    public void deletarUsuario(@PathVariable int id) {
        servico.deletarUsuario(id);
    }
}
