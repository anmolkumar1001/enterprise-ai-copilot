package com.anmol.backend.controller;

import com.anmol.backend.entity.Document;
import com.anmol.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public Document uploadPdf(@RequestParam("file") MultipartFile file, @RequestParam Long sessionId) throws Exception {

        return documentService.uploadPdf(file, sessionId);
    }

    @GetMapping
    public List<Document> getAllDocuments() {

        return documentService.getAllDocuments();
    }

    @GetMapping("/{sessionId}")
    public List<Document> getDocumentsBySession(@PathVariable Long sessionId) {

        return documentService.getDocumentsBySession(sessionId);
    }
}
