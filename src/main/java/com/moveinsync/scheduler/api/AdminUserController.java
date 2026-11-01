package com.moveinsync.scheduler.api;

import com.moveinsync.scheduler.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/{username}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public Map<String, String> updateRole(
            @PathVariable String username,
            @RequestBody Map<String, String> request
    ) {
        String role = request.get("role");

        if (role == null ||
                !role.matches("EMPLOYEE|OPERATOR|ADMIN")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid role. Allowed: EMPLOYEE, OPERATOR, ADMIN"
            );
        }

        int updated = userRepository.updateRoleByUsername(username, role);

        if (updated == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        return Map.of(
                "username", username,
                "role", role,
                "message", "User role updated successfully"
        );
    }
}