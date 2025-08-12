package com.harpya.harpya_spring_boot.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.harpya.harpya_spring_boot.model.Usuario;
import com.harpya.harpya_spring_boot.repo.UsuarioRepo;

@Service
public class UsuarioDetailsService implements UserDetailsService {
	private UsuarioRepo repo;

	public UsuarioDetailsService(UsuarioRepo repo) {
		this.repo = repo;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Usuario usuario = repo.findByEmailUsuario(email);
		return new User(usuario.getEmailUsuario(), usuario.getSenha_hash(),
				Collections.singletonList(new SimpleGrantedAuthority("USER")));
	}
}
