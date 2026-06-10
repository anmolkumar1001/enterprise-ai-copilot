package com.anmol.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(
            mappedBy = "session",

            // When a session is deleted,
            // all chats belonging to that session
            // will also be deleted automatically
            cascade = CascadeType.ALL,

            // If a chat is removed from the session
            // and no longer belongs to any session,
            // Hibernate will delete it from the database
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Chat> chats;
}
