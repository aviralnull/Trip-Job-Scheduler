
package com.moveinsync.scheduler.api;

import com.moveinsync.scheduler.api.dto.CurrentUserResponse;
import com.moveinsync.scheduler.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class CurrentUserController {

    private final UserRepository userRepository;

    public CurrentUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public CurrentUserResponse me() {
        String username = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

        var user = userRepository
            .findByUsernameIgnoreCase(username)
            .orElseThrow(() ->
                new IllegalStateException("User not found")
            );

        return new CurrentUserResponse(
            user.getUsername(),
            user.getRole(),
            user.getTenantId()
        );
    }
}

