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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private DocumentService documentService;

    public Chat createChat(Long sessionId, String email, ChatRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Load previous chats in this session
        List<Chat> previousChats = chatRepository.findBySessionOrderByCreatedAtAsc(session);

        // Build conversation history
        List<java.util.Map<String, String>> messages = new java.util.ArrayList<>();

        for(Chat oldChat : previousChats) {

            messages.add(java.util.Map.of(
                    "role", "user",
                    "content", oldChat.getUserMessage()
            ));

            messages.add(java.util.Map.of(
                    "role", "assistant",
                    "content", oldChat.getAiResponse()
            ));
        }

        // Add current user message
        messages.add(
                java.util.Map.of(
                        "role", "user",
                        "content", request.getMessage()
                )
        );

        // call Groq with full history
//        String aiResponse = aiService.getResponse(messages);

        String documentContext = documentService.getAllDocumentContent();

        String aiResponse = aiService.getResponse(messages, documentContext);

        Chat chat = new Chat();

        chat.setTitle(request.getTitle());
        chat.setUserMessage(request.getMessage());

        chat.setAiResponse(aiResponse);

        chat.setCreatedAt(LocalDateTime.now());

        chat.setUser(user);

        chat.setSession(session);

        // Auto-generate session title from first message
        if(session.getTitle().equals("New Chat")) {

            String title = request.getMessage();

            // Limit title length
            if(title.length() > 30) {
                title = title.substring(0, 30) + "...";
            }

            session.setTitle(title);

            chatSessionRepository.save(session);
        }

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

        return chatRepository.findBySessionOrderByCreatedAtAsc(session);
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

    public Chat regenerateResponse(Long id) {

        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(
                Map.of(
                        "role",
                        "user",
                        "content",
                        chat.getUserMessage()
                )
        );

        String documentContext =
                documentService.getAllDocumentContent();

        String newResponse =
                aiService.getResponse(
                        messages,
                        documentContext
                );

        chat.setAiResponse(newResponse);

        return chatRepository.save(chat);
    }

    public void deleteChat(Long id) {

        chatRepository.deleteById(id);
    }
}
