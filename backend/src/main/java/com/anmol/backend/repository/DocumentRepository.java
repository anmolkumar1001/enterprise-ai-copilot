package com.anmol.backend.repository;

import com.anmol.backend.entity.ChatSession;
import com.anmol.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAllByOrderByUploadedAtDesc();

    List<Document> findBySessionOrderByUploadedAtDesc(ChatSession session);
}
