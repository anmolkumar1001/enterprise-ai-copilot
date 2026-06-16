package com.anmol.backend.controller;

import com.anmol.backend.dto.ChatRequest;
import com.anmol.backend.entity.Chat;
import com.anmol.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/sessions/{sessionId}/messages")
    public Chat createChat(@PathVariable Long sessionId, @RequestBody ChatRequest request, Authentication authentication) {

        String email = authentication.getName();

        return chatService.createChat(sessionId, email, request);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public List<Chat> getMessagesBySession(@PathVariable Long sessionId) {

        return chatService.getMessagesBySession(sessionId);
    }

    @GetMapping
    public List<Chat> getChats(Authentication authentication) {

        String email = authentication.getName();

        return chatService.getAllChats(email);
    }

    @DeleteMapping("/{id}")
    public String deleteChat(@PathVariable Long id) {

        chatService.deleteChat(id);

        return "Chat deleted successfully";
    }

    @PutMapping("/{id}/like")
    public Chat likeMessage(@PathVariable Long id) {
        return chatService.likeMessage(id);
    }

    @PutMapping("/{id}/regenerate")
    public Chat regenerateResponse(@PathVariable Long id) {

        return chatService.regenerateResponse(id);
    }

    @PutMapping("/{id}/dislike")
    public Chat dislikeMessage(@PathVariable Long id) {
        return chatService.dislikeMessage(id);
    }
}
