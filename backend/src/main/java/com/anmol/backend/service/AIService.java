package com.anmol.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    // Used to make HTTP requests to Groq API
    private final RestTemplate restTemplate = new RestTemplate();

    public String getResponse(String prompt) {

        // Groq Chat Completion API endpoint
        String url = "https://api.groq.com/openai/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.3-70b-versatile");
        body.put("messages", List.of(message));

        // Combine headers + body into one request object
        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        // Send POST request to Groq API
        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        Map.class
                );

        try {
            // Extract choices array
            List choices = (List) response.getBody().get("choices");

            // Get first choice
            Map choice = (Map) choices.get(0);

            // Get message object
            Map msg = (Map) choice.get("message");

            // Return AI response text
            return msg.get("content").toString();

        } catch (Exception e) {
            return "Failed to generate AI response";
        }
    }
}