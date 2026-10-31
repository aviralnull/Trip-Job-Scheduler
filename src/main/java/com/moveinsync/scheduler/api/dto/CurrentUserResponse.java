
package com.moveinsync.scheduler.api.dto;

public record CurrentUserResponse(
    String username,
    String role,
    String tenantId
) {}

