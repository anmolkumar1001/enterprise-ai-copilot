package com.anmol.backend.service;

import com.anmol.backend.dto.ChatRequest;
import com.anmol.backend.entity.Chat;
import com.anmol.backend.entity.ChatSession;
import com.anmol.backend.entity.User;
import com.anmol.backend.repository.ChatRepository;
import com.anmol.backend.repository.ChatSessionRepository;
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

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private AIService aiService;

    public Chat createChat(Long sessionId, String email, ChatRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Chat chat = new Chat();

        chat.setTitle(request.getTitle());
        chat.setUserMessage(request.getMessage());

        String aiResponse =
                aiService.getResponse(
                        request.getMessage()
                );

        chat.setAiResponse(aiResponse);

        chat.setCreatedAt(LocalDateTime.now());

        chat.setUser(user);

        chat.setSession(session);

        return chatRepository.save(chat);
    }

    public List<Chat> getAllChats(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatRepository.findByUser(user);
    }

    public List<Chat> getMessagesBySession(Long sessionId) {

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        return chatRepository.findBySession(session);
    }

    public Chat likeMessage(Long id) {

        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        chat.setLiked(true);
        chat.setDisliked(false);

        return chatRepository.save(chat);
    }

    public Chat dislikeMessage(Long id) {

        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        chat.setLiked(false);
        chat.setDisliked(true);

        return chatRepository.save(chat);
    }

    public void deleteChat(Long id) {
        chatRepository.deleteById(id);
    }
}
