package com.harpya.harpya_spring_boot.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.harpya.harpya_spring_boot.model.Login;
import org.springframework.stereotype.Repository;

public interface LoginRepo extends JpaRepository<Login, Integer> {

}
