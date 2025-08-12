package com.harpya.harpya_spring_boot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.harpya.harpya_spring_boot.model.LoginRegistro;

public interface LoginRegistroRepo extends JpaRepository<LoginRegistro, Integer> {
    // pode ter métodos customizados depois, se precisar
}
