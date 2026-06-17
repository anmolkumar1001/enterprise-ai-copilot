package com.anmol.backend.service;

import com.anmol.backend.entity.Document;
import com.anmol.backend.repository.DocumentRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public Document uploadPdf(MultipartFile file) throws Exception {

        PDDocument pdf = PDDocument.load(file.getInputStream());

        PDFTextStripper stripper = new PDFTextStripper();

        String content = stripper.getText(pdf);

        pdf.close();

        Document document = new Document();

        document.setFileName(file.getOriginalFilename());
        document.setContent(content);
        document.setUploadedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {

        return documentRepository.findAllByOrderByUploadedAtDesc();
    }

    public String getAllDocumentContent() {

        List<Document> documents = documentRepository.findAll();

        StringBuilder context = new StringBuilder();

        for(Document doc : documents) {

            context.append(doc.getContent()).append("\n\n");
        }

        return context.toString();
    }
}