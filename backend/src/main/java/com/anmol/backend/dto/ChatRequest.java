package com.anmol.backend.dto;

import lombok.Data;

@Data
public class ChatRequest {

    private String title;

    private String message;

    private Long sessionId;
}
