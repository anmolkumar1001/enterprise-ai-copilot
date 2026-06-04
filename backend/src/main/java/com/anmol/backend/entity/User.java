package com.anmol.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String role = "USER";

    // One user can have multiple chats
    @OneToMany(mappedBy = "user")

    // Prevents infinite JSON recursion:
    // User -> Chats -> User -> Chats -> ...
    // Also avoids sending all chat history whenever User is returned in an API response
    @JsonIgnore
    private List<Chat> chats;
}
