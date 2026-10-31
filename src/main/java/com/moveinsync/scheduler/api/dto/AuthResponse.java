
package com.moveinsync.scheduler.api.dto;

public record AuthResponse(
        String message,
        String username,
        String role
) {}
