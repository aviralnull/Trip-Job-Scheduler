
package com.moveinsync.scheduler.api;

import com.moveinsync.scheduler.api.dto.AuthResponse;
import com.moveinsync.scheduler.api.dto.RegisterRequest;
import com.moveinsync.scheduler.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signup(
            @Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
