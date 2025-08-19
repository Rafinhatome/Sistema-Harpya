package com.harpya.harpya_spring_boot.repo;

import com.harpya.harpya_spring_boot.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginRepo extends JpaRepository<Login, Integer> {

    // Consulta corrigida para usar a coluna 'data_hora'
    @Query(value = "SELECT * FROM login WHERE SUBSTR(data_hora, 6, 2) = :mes AND SUBSTR(data_hora, 1, 4) = :ano", nativeQuery = true)
    List<Login> findByMesAndAno(@Param("mes") String mes, @Param("ano") String ano);
}