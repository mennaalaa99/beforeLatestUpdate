package com.clinic.backend.security;

import com.clinic.backend.exception.UnauthorizedException;
import com.clinic.backend.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey secretKey;
    private final long tokenTtlMs;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-ms:86400000}") long tokenTtlMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.tokenTtlMs = tokenTtlMs;
        //System.out.println(secret);
    }

    public String generateToken(Long userId, Role role) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(tokenTtlMs);
        return Jwts.builder()
                .subject(userId.toString())
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey)
                .compact();
    }

    public AuthenticatedUser parseToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return toUser(claims);
        } catch (Exception ex) {
            throw new UnauthorizedException("Invalid or expired token.");
        }
    }

    private AuthenticatedUser toUser(Claims claims) {
        Long userId = Long.valueOf(claims.getSubject());
        Role role = Role.valueOf(claims.get("role", String.class));
        return new AuthenticatedUser(userId, role);
    }
}
