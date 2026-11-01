package com.moveinsync.scheduler.api.dto;

import com.moveinsync.scheduler.domain.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

public record UpdateJobRequest(
    @NotBlank @Size(max = 160) String name,
    @NotNull JobType type,
    String cronExpression,
    @NotBlank String payload,
    @NotBlank String zoneId,
    Instant fireAt,
    @Min(0) @Max(100) int priority,
    @Min(1) @Max(86400) int maxRuntimeSeconds,
    @NotNull MisfirePolicy misfirePolicy
) {}