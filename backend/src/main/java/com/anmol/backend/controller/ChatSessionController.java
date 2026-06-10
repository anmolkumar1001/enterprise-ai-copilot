package com.anmol.backend.controller;

import com.anmol.backend.dto.CreateSessionRequest;
import com.anmol.backend.entity.ChatSession;
import com.anmol.backend.service.ChatSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class ChatSessionController {

    @Autowired
    private ChatSessionService chatSessionService;

    @PostMapping
    public ChatSession createSession(@RequestBody CreateSessionRequest request, Authentication authentication) {

        String email = authentication.getName();

        return chatSessionService.createSession(email, request);
    }

    @GetMapping
    public List<ChatSession> getAllSessions(Authentication authentication) {

        String email = authentication.getName();

        return chatSessionService.getAllSessions(email);
    }

    @GetMapping("/{id}")
    public ChatSession getSessionById(@PathVariable Long id) {

        return chatSessionService.getSessionById(id);
    }

    @PutMapping("/{id}")
    public ChatSession renameSession(@PathVariable Long id, @RequestBody CreateSessionRequest request) {

        return chatSessionService.renameSession(id, request.getTitle());
    }

    @DeleteMapping("/{id}")
    public String deleteSession(@PathVariable Long id) {

        chatSessionService.deleteSession(id);

        return "Session deleted successfully";
    }
}
