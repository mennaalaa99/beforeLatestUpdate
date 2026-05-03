package com.clinic.backend.service;

import com.clinic.backend.exception.ConflictException;
import com.clinic.backend.model.Role;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Service;

@Service
public class DashboardPermissionService {
    private static final List<String> SUPPORTED_KEYS = List.of(
            "RECEPTIONIST_TAB_APPOINTMENTS",
            "RECEPTIONIST_TAB_OWNERS",
            "RECEPTIONIST_TAB_INVOICES",
            "OWNER_TAB_APPOINTMENTS",
            "OWNER_TAB_BILLING",
            "OWNER_TAB_PROFILE",
            "VET_TAB_TODAY",
            "VET_TAB_ALL",
            "VET_TAB_RECORDS"
    );

    private final Map<Role, Map<String, Boolean>> defaults;
    private final ConcurrentMap<Role, ConcurrentMap<String, Boolean>> overrides = new ConcurrentHashMap<>();

    public DashboardPermissionService() {
        defaults = Map.of(
                Role.RECEPTIONIST, mapOf(
                        "RECEPTIONIST_TAB_APPOINTMENTS", true,
                        "RECEPTIONIST_TAB_OWNERS", true,
                        "RECEPTIONIST_TAB_INVOICES", true
                ),
                Role.PET_OWNER, mapOf(
                        "OWNER_TAB_APPOINTMENTS", true,
                        "OWNER_TAB_BILLING", true,
                        "OWNER_TAB_PROFILE", true
                ),
                Role.VET, mapOf(
                        "VET_TAB_TODAY", true,
                        "VET_TAB_ALL", true,
                        "VET_TAB_RECORDS", true
                ),
                Role.ADMIN, mapOf()
        );
    }

    public Map<String, Boolean> getPermissionsForRole(Role role) {
        Map<String, Boolean> result = new LinkedHashMap<>();
        for (String key : SUPPORTED_KEYS) {
            result.put(key, false);
        }
        result.putAll(defaults.getOrDefault(role, Map.of()));
        result.putAll(overrides.getOrDefault(role, new ConcurrentHashMap<>()));
        return result;
    }

    public Map<Role, Map<String, Boolean>> getAllByRole() {
        Map<Role, Map<String, Boolean>> result = new LinkedHashMap<>();
        for (Role role : Role.values()) {
            result.put(role, getPermissionsForRole(role));
        }
        return result;
    }

    public void updatePermission(Role role, String permissionKey, boolean enabled) {
        if (!SUPPORTED_KEYS.contains(permissionKey)) {
            throw new ConflictException("Unsupported permission key: " + permissionKey);
        }
        overrides.computeIfAbsent(role, r -> new ConcurrentHashMap<>()).put(permissionKey, enabled);
    }

    private static Map<String, Boolean> mapOf(Object... pairs) {
        Map<String, Boolean> map = new LinkedHashMap<>();
        for (int i = 0; i < pairs.length; i += 2) {
            map.put((String) pairs[i], (Boolean) pairs[i + 1]);
        }
        return map;
    }
}
