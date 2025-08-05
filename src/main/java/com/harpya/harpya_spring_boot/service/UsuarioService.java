package com.harpya.harpya_spring_boot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.harpya.harpya_spring_boot.model.Usuario;
import com.harpya.harpya_spring_boot.repo.UsuarioRepo;

@CrossOrigin
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Create
    public Usuario InserirUsuario(Usuario u) {
        // Criptografa a senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(u.getSenha_hash());
        u.setSenha_hash(senhaCriptografada);
        return repo.save(u);
    }

    // Read
    public List<Usuario> listarUsuario() {
        return repo.findAll();
    }
    
    public Usuario buscarUsuarioPorId(int id) {
        return repo.findById(id).orElse(null); // ou lançar uma exceção se preferir
    }

    // Update
    public void atualizarUsuario(Usuario u) {
        // Também criptografa a nova senha se for alterada
        String senhaCriptografada = passwordEncoder.encode(u.getSenha_hash());
        u.setSenha_hash(senhaCriptografada);
        repo.save(u);
    }

    // Delete
    public void deletarUsuario(int id) {
        repo.deleteById(id);
    }
    
    public Usuario buscarPorEmail(String email) {
        return repo.findByEmailUsuario(email);
    }
    
}
