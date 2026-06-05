package com.anmol.backend.service;

import com.anmol.backend.dto.CreateSessionRequest;
import com.anmol.backend.entity.ChatSession;
import com.anmol.backend.entity.User;
import com.anmol.backend.repository.ChatSessionRepository;
import com.anmol.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatSessionService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatSession createSession(String email, CreateSessionRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = new ChatSession();

        session.setTitle(request.getTitle());
        session.setCreatedAt(LocalDateTime.now());
        session.setUser(user);

        return chatSessionRepository.save(session);
    }

    public List<ChatSession> getAllSessions(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatSessionRepository.findByUser(user);
    }

    public ChatSession getSessionById(Long sessionId) {

        return chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public void deleteSession(Long sessionId) {

        if(!chatSessionRepository.existsById(sessionId)) {
            throw new RuntimeException("Session not found");
        }

        chatSessionRepository.deleteById(sessionId);
    }
}
