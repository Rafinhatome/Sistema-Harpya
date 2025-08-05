package com.harpya.harpya_spring_boot.model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.harpya.harpya_spring_boot.model.Endereco;
import com.harpya.harpya_spring_boot.service.EnderecoService;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/enderecos")
@CrossOrigin
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    // POST - Inserir endereço para um usuário
    @PostMapping("/{idUsuario}")
    public Endereco inserirEndereco(@PathVariable int idUsuario, @RequestBody Endereco endereco) {
        return enderecoService.inserirEnderecoParaUsuario(idUsuario, endereco);
    }

    // GET - Listar todos os endereços
    @GetMapping
    public List<Endereco> listarEnderecos() {
        return enderecoService.listarEnderecos();
    }

    // GET - Buscar endereço por ID do usuário
    @GetMapping("/usuario/{idUsuario}")
    public Endereco buscarEnderecoPorUsuario(@PathVariable int idUsuario) {
        return enderecoService.buscarEnderecoPorUsuario(idUsuario);
    }

    // PUT - Atualizar endereço de um usuário
    @PutMapping("/usuario/{idUsuario}")
    public Endereco atualizarEndereco(@PathVariable int idUsuario, @RequestBody Endereco enderecoAtualizado) {
        return enderecoService.atualizarEnderecoDoUsuario(idUsuario, enderecoAtualizado);
    }

    // DELETE - Deletar endereço por ID do endereço
    @DeleteMapping("/{id}")
    public void deletarEndereco(@PathVariable int id) {
        enderecoService.deletarEndereco(id);
    }
}
