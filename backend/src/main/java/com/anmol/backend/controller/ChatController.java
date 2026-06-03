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

    @PostMapping
    public Chat createChat(@RequestBody ChatRequest request, Authentication authentication) {

        String email = authentication.getName();

        return chatService.createChat(email, request);
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
}
