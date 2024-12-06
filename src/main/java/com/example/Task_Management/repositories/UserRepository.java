package com.example.Task_Management.repositories;

import com.example.Task_Management.entities.User;
import com.example.Task_Management.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByEmail(String username);

    Optional<User> findByUserRole(UserRole admin);

    User findByEmail(String email);
}
