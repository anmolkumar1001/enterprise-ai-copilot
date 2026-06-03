package com.anmol.backend.service;

import com.anmol.backend.dto.ChatRequest;
import com.anmol.backend.entity.Chat;
import com.anmol.backend.entity.User;
import com.anmol.backend.repository.ChatRepository;
import com.anmol.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    public Chat createChat(String email, ChatRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Chat chat = new Chat();

        chat.setTitle(request.getTitle());
        chat.setUserMessage(request.getMessage());

        // Placeholder response for now
        chat.setAiResponse("AI integration will be added in Day 7");

        chat.setCreatedAt(LocalDateTime.now());

        chat.setUser(user);

        return chatRepository.save(chat);
    }

    public List<Chat> getAllChats(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatRepository.findByUser(user);
    }

    public void deleteChat(Long id) {
        chatRepository.deleteById(id);
    }
}
