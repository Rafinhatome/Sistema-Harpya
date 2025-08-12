package com.harpya.harpya_spring_boot.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private UsuarioDetailsService user;

	public SecurityConfig(UsuarioDetailsService user) {
		this.user = user;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configure(http)) // Habilita CORS
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/css/**", "/assets/**", "/js/**").permitAll().anyRequest().authenticated())
				.formLogin(form -> form.loginPage("/html/login.html") // Define a página de login personalizada
						.loginProcessingUrl("/perform_login").usernameParameter("email") // Campo de email no formulário
						.passwordParameter("password") // Campo de senha no formulário
						.defaultSuccessUrl("http://index.html", true).permitAll()) // Permite acesso à página de login
																					// sem autenticação
				.logout(logout -> logout.permitAll()); // Permite logout sem autenticação
		return http.build();
	}

	// Configuração global de CORS
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("http://127.0.0.1:5500") // ou "*" para testes
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*")
						.allowCredentials(true);
			}
		};

}
}
