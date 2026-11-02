
package com.moveinsync.scheduler.service;

import com.moveinsync.scheduler.api.dto.AuthResponse;
import com.moveinsync.scheduler.api.dto.RegisterRequest;
import com.moveinsync.scheduler.domain.User;
import com.moveinsync.scheduler.repository.UserRepository;
// import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
@Transactional
public AuthResponse register(RegisterRequest request) {

    String username = request.username().trim();
    String email = request.email().trim().toLowerCase();
    String name = request.name().trim();

    if (userRepository.existsByUsernameIgnoreCase(username)) {
        throw new IllegalArgumentException(
            "Username is already registered."
        );
    }

    if (userRepository.existsByEmailIgnoreCase(email)) {
        throw new IllegalArgumentException(
            "Email is already registered."
        );
    }

    // Public signup par hamesha EMPLOYEE role.
    // User khud ADMIN ya OPERATOR nahi ban sakta.
    String tenantId = username;

    User user = new User(
        UUID.randomUUID(),
        name,
        email,
        username,
        passwordEncoder.encode(request.password()),
        "ADMIN",
        tenantId
    );

    userRepository.saveAndFlush(user);

    return new AuthResponse(
        "Registration successful.",
        username,
        "ADMIN"
    );
}
}
