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

    private final RestTemplate restTemplate = new RestTemplate();

    public String getResponse(List<Map<String, String>> messages, String documentContext) {

        String url = "https://api.groq.com/openai/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Add system prompt
        List<Map<String, String>> finalMessages = new ArrayList<>();

        String systemPrompt = """
        You are a helpful AI assistant.

        Rules:
        - Give concise answers.
        - Use bullet points whenever possible.
        - For technical topics use this format:

        Definition:
        Short definition

        Features:
        - Point 1
        - Point 2
        - Point 3

        Example:
        Give an example if needed.

        Keep answers under 150 words unless the user asks for detailed explanations.
        """;

        if(documentContext != null && !documentContext.isBlank()) {

            systemPrompt += """

        Additional Instructions:
        - Use the uploaded document content when answering questions.
        - Prefer document information when relevant.
        - If the answer is not found in the documents, answer normally.

        DOCUMENT CONTENT:
        """ + documentContext.substring(
                0, Math.min(documentContext.length(), 10000)  // Limiting to ~10k chars is enough for testing.
            );
        }

        finalMessages.add(
                Map.of(
                        "role", "system",
                        "content", systemPrompt
                )
        );

        // Add conversation history
        finalMessages.addAll(messages);

        Map<String, Object> body = new HashMap<>();

        body.put(
                "model",
                "llama-3.3-70b-versatile"
        );

        body.put(
                "messages",
                finalMessages
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(
                        body,
                        headers
                );

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        Map.class
                );

        try {

            List choices =
                    (List) response.getBody()
                            .get("choices");

            Map choice =
                    (Map) choices.get(0);

            Map message =
                    (Map) choice.get("message");

            return message.get("content")
                    .toString();

        } catch (Exception e) {

            return "Failed to generate AI response";
        }
    }
}