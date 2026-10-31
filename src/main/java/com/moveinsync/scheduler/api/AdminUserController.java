package com.moveinsync.scheduler.api;
import java.util.HashMap;
import com.moveinsync.scheduler.domain.User;
import com.moveinsync.scheduler.repository.UserRepository;

// import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository users;

    public AdminUserController(UserRepository users) {
        this.users = users;
    }

    @GetMapping
    public List<Map<String, Object>> getUsers() {
        return users.findAll().stream().map(user -> {
            Map<String, Object> result = new HashMap<>();
            result.put("id", user.getId());
            result.put("name", user.getName());
            result.put("email", user.getEmail());
            result.put("username", user.getUsername());
            result.put("role", user.getRole());
            result.put("tenantId", user.getTenantId());
            result.put("enabled", user.isEnabled());
            return result;
        }).toList();
    }

    @PutMapping("/{username}/role")
    @Transactional
    public Map<String, String> updateRole(
            @PathVariable String username,
            @RequestBody Map<String, String> body) {

        String role = body.get("role");

        if (!List.of("ADMIN", "OPERATOR", "EMPLOYEE").contains(role)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid role"
            );
        }

        User user = users.findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if ("ADMIN".equals(user.getRole())
                && !"ADMIN".equals(role)
                && users.countByRoleAndEnabledTrue("ADMIN") <= 1) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Cannot demote last admin"
            );
        }

        users.updateRoleByUsername(username, role);

        return Map.of("message", "Role updated", "role", role);
    }

    @PutMapping("/{username}/status")
    @Transactional
    public Map<String, Object> updateStatus(
            @PathVariable String username,
            @RequestBody Map<String, Boolean> body) {

        boolean enabled = Boolean.TRUE.equals(body.get("enabled"));

        User user = users.findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        if (!enabled && "ADMIN".equals(user.getRole())
                && user.isEnabled()
                && users.countByRoleAndEnabledTrue("ADMIN") <= 1) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Cannot disable last admin"
            );
        }

        user.setEnabled(enabled);

        return Map.of("username", username, "enabled", enabled);
    }



    
@PatchMapping("/{id}")
@Transactional
@PreAuthorize("hasRole('ADMIN')")
public Map<String, Object> updateUser(
        @PathVariable UUID id,
        @RequestBody UpdateUserRequest request) {

    if (request.role() == null ||
        !List.of("ADMIN", "OPERATOR", "EMPLOYEE").contains(request.role()) ||
        request.enabled() == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Invalid role or status"
        );
    }

    User user = users.findById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "User not found"
        ));

    boolean removingAdmin =
        "ADMIN".equals(user.getRole()) &&
        (!"ADMIN".equals(request.role()) || !request.enabled()) &&
        user.isEnabled();

    if (removingAdmin &&
        users.countByRoleAndEnabledTrue("ADMIN") <= 1) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Cannot remove or disable the last active administrator"
        );
    }

    user.setRole(request.role());
    user.setEnabled(request.enabled());

    users.save(user);

    return Map.of(
        "message", "User updated successfully",
        "id", user.getId().toString(),
        "role", user.getRole(),
        "enabled", user.isEnabled()
    );
}

public record UpdateUserRequest(String role, Boolean enabled) {}

}