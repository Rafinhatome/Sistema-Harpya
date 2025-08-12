package com.harpya.harpya_spring_boot.model;



import com.harpya.harpya_spring_boot.service.UsuarioService;
import com.harpya.harpya_spring_boot.service.reconhecimentoFacialService;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;



import java.util.Map;





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


@GetMapping("/usuarios/{id}")

public ResponseEntity<Usuario> buscarPorId(@PathVariable int id) {

Usuario usuario = servico.buscarUsuarioPorId(id);

if (usuario != null) {

return ResponseEntity.ok(usuario);

} else {

return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

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


@RestController

@RequestMapping("/api/usuarios")

public class usuarioController {



@Autowired

private reconhecimentoFacialService reconhecimentoFacialService;



// Seus outros endpoints (cadastrar, listar, etc.)

// ...



@PostMapping("/cadastro-facial/{idUsuario}")

public ResponseEntity<String> cadastrarRosto(@PathVariable String idUsuario, @RequestBody Map<String, String> payload) {

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


}