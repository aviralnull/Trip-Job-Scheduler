
package com.moveinsync.scheduler.service;

import com.moveinsync.scheduler.api.dto.*;
import com.moveinsync.scheduler.domain.*;
import com.moveinsync.scheduler.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
public class JobService {

    private final JobRepository jobs;
    private final Partitioner partitioner;

    public JobService(
            JobRepository jobs,
            Partitioner partitioner,
            com.fasterxml.jackson.databind.ObjectMapper mapper
    ) {
        this.jobs = jobs;
        this.partitioner = partitioner;
    }

    @Transactional
    public JobResponse create(String tenant, CreateJobRequest r) {

        ZoneId zone = ZoneId.of(r.zoneId());

        if (r.type() == JobType.ONE_OFF && r.fireAt() == null) {
            throw new IllegalArgumentException(
                "fireAt is required for one-off jobs"
            );
        }

        if (r.type() == JobType.CRON &&
                (r.cronExpression() == null || r.cronExpression().isBlank())) {
            throw new IllegalArgumentException(
                "cronExpression is required for recurring jobs"
            );
        }

        Instant next = r.type() == JobType.ONE_OFF
                ? r.fireAt()
                : CronTimes.next(r.cronExpression(), zone, Instant.now());

        UUID provisional = UUID.randomUUID();
        int p = partitioner.partition(tenant, provisional);

        ScheduledJob job = new ScheduledJob(
            tenant,
            r.name(),
            r.type(),
            r.cronExpression(),
            r.payload(),
            zone,
            next,
            r.priority(),
            r.maxRuntimeSeconds(),
            r.misfirePolicy(),
            p
        );

        job = jobs.save(job);
        return toResponse(job);
    }

    public List<JobResponse> list(String tenant) {
        return jobs.findByTenantIdAndStatus(tenant, JobStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void tenantStatus(String tenant, JobStatus status) {
        jobs.updateTenantStatus(tenant, status);
    }

    @Transactional
    public JobResponse get(String tenant, UUID id) {
        return jobs.findByIdAndTenantId(id, tenant)
                .map(this::toResponse)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));
    }

    // Pause one individual job
    @Transactional
    public void pauseJob(String tenantId, UUID id) {

        ScheduledJob job = jobs.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        job.setStatus(JobStatus.PAUSED);
        jobs.save(job);
    }

    // Resume one individual job
    @Transactional
    public void resumeJob(String tenantId, UUID id) {

        ScheduledJob job = jobs.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        job.setStatus(JobStatus.ACTIVE);
        jobs.save(job);
    }

    // private JobResponse toResponse(ScheduledJob j) {
    //     return new JobResponse(
    //         j.getId(),
    //         j.getName(),
    //         j.getType(),
    //         j.getStatus(),
    //         j.getNextFireAt(),
    //         j.getPartitionId()
    //     );
    // }

    private JobResponse toResponse(ScheduledJob j) {
    return JobResponse.from(j);
}
}
