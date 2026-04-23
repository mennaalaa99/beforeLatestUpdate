package com.clinic.backend.service;

import com.clinic.backend.dto.auth.AuthResponse;
import com.clinic.backend.dto.auth.LoginRequest;
import com.clinic.backend.dto.auth.RegisterRequest;
import com.clinic.backend.exception.UnauthorizedException;
import com.clinic.backend.model.Patient;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final PatientService patientService;

    public AuthService(
            PatientService patientService) {
        this.patientService = patientService;
    }

    public AuthResponse register(RegisterRequest request) {
        Patient patient = patientService.register(request);
        return toResponse(patient);
    }

    public AuthResponse login(LoginRequest request) {
        Patient patient = patientService.getByEmail(request.email());
        if (!patientService.matchesPassword(patient, request.password())) {
            throw new UnauthorizedException("Invalid credentials.");
        }
        return toResponse(patient);
    }

    private AuthResponse toResponse(Patient patient) {
        return new AuthResponse(
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                patient.getPhone(),
                patient.getRole()
        );
    }
}
