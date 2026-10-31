// package com.moveinsync.scheduler.api.dto;
// import com.moveinsync.scheduler.domain.*;
// import java.time.Instant;
// import java.util.UUID;
// public record JobResponse(UUID id,String name,JobType type,JobStatus status,Instant nextFireAt,int partitionId) {}



package com.moveinsync.scheduler.api.dto;

import com.moveinsync.scheduler.domain.*;
import java.time.Instant;
import java.util.UUID;

public record JobResponse(
    UUID id,
    String tenantId,
    String name,
    JobType type,
    JobStatus status,
    String cronExpression,
    String payload,
    String zoneId,
    Instant nextFireAt,
    int priority,
    int maxRuntimeSeconds,
    MisfirePolicy misfirePolicy,
    int partitionId,
    Instant createdAt,
    long version
) {
    public static JobResponse from(ScheduledJob job) {
        return new JobResponse(
            job.getId(),
            job.getTenantId(),
            job.getName(),
            job.getType(),
            job.getStatus(),
            job.getCronExpression(),
            job.getPayload(),
            job.getZoneId().getId(),
            job.getNextFireAt(),
            job.getPriority(),
            job.getMaxRuntimeSeconds(),
            job.getMisfirePolicy(),
            job.getPartitionId(),
            job.getCreatedAt(),
            job.getVersion()
        );
    }
}
