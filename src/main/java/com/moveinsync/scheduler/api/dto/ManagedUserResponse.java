package com.moveinsync.scheduler.api.dto;

import java.time.Instant;
import java.util.UUID;

public record ManagedUserResponse(
    UUID id,
    String name,
    String email,
    String username,
    String role,
    boolean enabled,
    Instant createdAt
) {}