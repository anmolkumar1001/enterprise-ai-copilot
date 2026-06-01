package com.anmol.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET;

    // Convert secret string into SecretKey object required by JWT library
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email) {

        return Jwts.builder()

                // Store user email inside token
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact(); // Convert into jwt string
    }

    public String extractEmail(String token) {

        return Jwts.parser()

                .verifyWith(key)
                .build()

                // parse JWT token
                .parseSignedClaims(token)

                // Get payload section
                .getPayload()

                // Return email stored in subject
                .getSubject();
    }
}
