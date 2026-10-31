package com.moveinsync.scheduler.api.dto;

import com.moveinsync.scheduler.domain.RunStatus;
import java.time.Instant;
import java.util.UUID;

public record ExecutionResponse(
    UUID id,
    UUID jobId,
    RunStatus status,
    int attempts,
    Instant scheduledAt,
    Instant startedAt,
    Instant finishedAt,
    String lastError
) {}