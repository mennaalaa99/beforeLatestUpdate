package com.clinic.backend.service;

import com.clinic.backend.dto.auth.RegisterRequest;
import com.clinic.backend.dto.account.UpdateAccountRequest;
import com.clinic.backend.exception.ConflictException;
import com.clinic.backend.exception.ResourceNotFoundException;
import com.clinic.backend.model.Patient;
import com.clinic.backend.model.Role;
import com.clinic.backend.repository.PatientRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Patient> getAll() { return patientRepository.findAll(); }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient with id " + id + " was not found."));
    }

    public Patient getByEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient with email " + email + " was not found."));
    }

    public Patient register(RegisterRequest request) {
        patientRepository.findByEmail(request.email()).ifPresent(p -> {
            throw new ConflictException("Email is already registered.");
        });
        Patient patient = Patient.builder()
                .name(request.name()).email(request.email())
                .phone(request.phone())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.PET_OWNER).build();
        return patientRepository.save(patient);
    }

    public Patient updateAccount(Long id, UpdateAccountRequest request) {
        Patient current = getById(id);
        return patientRepository.save(current.toBuilder()
                .name(request.name()).phone(request.phone()).build());
    }

    public void delete(Long id) {
        if (!patientRepository.existsById(id))
            throw new ResourceNotFoundException("Patient with id " + id + " was not found.");
        patientRepository.deleteById(id);
    }

    /**
     * Migration-aware:
     * 1. BCrypt hash ($2a$ / $2b$) → check with BCrypt
     * 2. SHA-256 legacy hash       → check + re-hash with BCrypt silently
     * 3. Placeholder               → return false
     */
    public boolean matchesPassword(Patient patient, String rawPassword) {
        String stored = patient.getPassword();
        // Seed/dev placeholder passwords like "hashed_vet_001" were used in early iterations.
        // Treat them as legacy "plain text" and upgrade to BCrypt on successful login.
        if (stored.startsWith("hashed_")) {
            if (stored.equals(rawPassword)) {
                patientRepository.save(patient.toBuilder()
                        .password(passwordEncoder.encode(rawPassword)).build());
                return true;
            }
            return false;
        }
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$"))
            return passwordEncoder.matches(rawPassword, stored);
        String sha256 = sha256Hex(rawPassword);
        if (stored.equals(sha256)) {
            patientRepository.save(patient.toBuilder()
                    .password(passwordEncoder.encode(rawPassword)).build());
            return true;
        }
        return false;
    }

    public void resetPassword(Long id, String oldPassword, String newPassword) {
        Patient patient = getById(id);
        if (!matchesPassword(patient, oldPassword))
            throw new ConflictException("Old password is incorrect.");
        patientRepository.save(patient.toBuilder()
                .password(passwordEncoder.encode(newPassword)).build());
    }

    private String sha256Hex(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(text.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Could not hash password.", e);
        }
    }
}