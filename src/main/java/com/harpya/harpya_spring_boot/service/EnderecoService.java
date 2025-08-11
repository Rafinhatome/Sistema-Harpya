package com.harpya.harpya_spring_boot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.harpya.harpya_spring_boot.model.Endereco;
import com.harpya.harpya_spring_boot.model.Usuario;
import com.harpya.harpya_spring_boot.repo.EnderecoRepo;
import com.harpya.harpya_spring_boot.repo.UsuarioRepo;

@SuppressWarnings("unused")
@CrossOrigin
@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepo enderecoRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    // Create: Inserir endereço para um usuário
    public Endereco inserirEnderecoParaUsuario(int idUsuario, Endereco e) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        e.setUsuario(usuario);
        return enderecoRepo.save(e);
    }

    // Read: Listar todos os endereços
    public List<Endereco> listarEnderecos() {
        return enderecoRepo.findAll();
    }

    // Read: Buscar endereço por ID do usuário
    public Endereco buscarEnderecoPorUsuario(int idUsuario) {
        return enderecoRepo.findByUsuarioId(idUsuario)
            .orElseThrow(() -> new RuntimeException("Endereço não encontrado para o usuário"));
    }

    // Update: Atualizar endereço de um usuário
    public Endereco atualizarEnderecoDoUsuario(int idUsuario, Endereco enderecoAtualizado) {
        Usuario usuario = usuarioRepo.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Optional<Endereco> enderecoExistente = enderecoRepo.findByUsuarioId(idUsuario);

        Endereco endereco;
        if (enderecoExistente.isPresent()) {
            endereco = enderecoExistente.get();
            endereco.setCep(enderecoAtualizado.getCep());
            endereco.setLogradouro(enderecoAtualizado.getLogradouro());
            endereco.setBairro(enderecoAtualizado.getBairro());
            endereco.setCidade(enderecoAtualizado.getCidade());
            endereco.setEstado(enderecoAtualizado.getEstado());
            endereco.setComplemento(enderecoAtualizado.getComplemento());
        } else {
            endereco = enderecoAtualizado;
            endereco.setUsuario(usuario);
        }

        return enderecoRepo.save(endereco);
    }

    // Delete: Deletar endereço por ID
    public void deletarEndereco(Integer id) {
        enderecoRepo.deleteById(id);
    }
}
