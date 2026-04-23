package com.clinic.backend.controller;

import com.clinic.backend.dto.owner.CreateOwnerRequest;
import com.clinic.backend.dto.owner.OwnerResponse;
import com.clinic.backend.dto.owner.UpdateOwnerRequest;
import com.clinic.backend.model.Owner;
import com.clinic.backend.model.Role;
import com.clinic.backend.security.AuthGuard;
import com.clinic.backend.security.AuthenticatedUser;
import com.clinic.backend.security.RoleGuard;
import com.clinic.backend.service.OwnerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;
    private final AuthGuard authGuard;
    private final RoleGuard roleGuard;

    public OwnerController(OwnerService ownerService, AuthGuard authGuard, RoleGuard roleGuard) {
        this.ownerService = ownerService;
        this.authGuard = authGuard;
        this.roleGuard = roleGuard;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OwnerResponse create(HttpServletRequest request, @Valid @RequestBody CreateOwnerRequest body) {
        authGuard.requireAuthenticatedUser(request);
        return toResponse(ownerService.create(body));
    }

    /** يجيب الـ owner profile بتاع المستخدم الحالي — لـ BookingAppointment */
    @GetMapping("/me")
    public OwnerResponse getMyOwnerProfile(HttpServletRequest request) {
        AuthenticatedUser user = authGuard.requireAuthenticatedUser(request);
        return toResponse(ownerService.getByUserId(user.userId()));
    }

    /** يحدّث بيانات owner profile للمستخدم الحالي */
    @PutMapping("/me")
    public OwnerResponse updateMyOwnerProfile(HttpServletRequest request,
                                              @Valid @RequestBody UpdateOwnerRequest body) {
        AuthenticatedUser user = authGuard.requireAuthenticatedUser(request);
        roleGuard.requireRole(user, Role.PET_OWNER, Role.ADMIN, Role.RECEPTIONIST);
        return toResponse(ownerService.updateByUserId(user.userId(), body));
    }

    @GetMapping("/{id}")
    public OwnerResponse getById(@PathVariable Long id, HttpServletRequest request) {
        authGuard.requireAuthenticatedUser(request);
        return toResponse(ownerService.getById(id));
    }

    @GetMapping
    public List<OwnerResponse> getAll(HttpServletRequest request) {
        AuthenticatedUser currentUser = authGuard.requireAuthenticatedUser(request);
        roleGuard.requireRole(currentUser, Role.ADMIN, Role.RECEPTIONIST);
        return ownerService.getAll().stream().map(this::toResponse).toList();
    }

    private OwnerResponse toResponse(Owner owner) {
        return new OwnerResponse(owner.getId(), owner.getUserId(),
                ownerService.displayName(owner), owner.getPhone(),
                owner.getAddress(), owner.getCity());
    }
}