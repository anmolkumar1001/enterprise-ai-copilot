package com.anmol.backend.repository;

import com.anmol.backend.entity.Chat;
import com.anmol.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByUser(User user);
}
