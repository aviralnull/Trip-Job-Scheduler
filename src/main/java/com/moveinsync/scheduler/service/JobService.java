package com.moveinsync.scheduler.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
private final UserRepository users;
private final Partitioner partitioner;
private final ObjectMapper mapper;

public JobService(
        JobRepository jobs,
        UserRepository users,
        Partitioner partitioner,
        ObjectMapper mapper
) {
    this.jobs = jobs;
    this.users = users;
    this.partitioner = partitioner;
    this.mapper = mapper;
}
    @Transactional
    public JobResponse create(String tenant, CreateJobRequest r) {
        ZoneId zone = ZoneId.of(r.zoneId());

        validateSchedule(r.type(), r.cronExpression(), r.fireAt());

        Instant next = r.type() == JobType.ONE_OFF
            ? r.fireAt()
            : CronTimes.next(r.cronExpression(), zone, Instant.now());

        UUID provisional = UUID.randomUUID();
        int partition = partitioner.partition(tenant, provisional);

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
            partition
        );

        return JobResponse.from(jobs.save(job));
    }

    // Include ACTIVE, PAUSED, COMPLETED and CANCELLED jobs.
 public List<JobResponse> list(String tenantId) {
    return jobs
        .findByTenantIdOrderByCreatedAtDesc(tenantId)
        .stream()
        .map(JobResponse::from)
        .toList();
}

    @Transactional(readOnly = true)
    public JobResponse get(String tenant, UUID id) {
        return findJob(tenant, id).map(JobResponse::from)
            .orElseThrow(() -> new NoSuchElementException("Job not found"));
    }

    @Transactional
    public JobResponse update(String tenant, UUID id, UpdateJobRequest r) {
        ScheduledJob job = findJob(tenant, id)
            .orElseThrow(() -> new NoSuchElementException("Job not found"));

        if (job.getStatus() == JobStatus.COMPLETED ||
            job.getStatus() == JobStatus.CANCELLED) {
            throw new IllegalStateException(
                "Completed or cancelled jobs cannot be edited"
            );
        }

        ZoneId zone = ZoneId.of(r.zoneId());
        validateSchedule(r.type(), r.cronExpression(), r.fireAt());

        Instant next = r.type() == JobType.ONE_OFF
            ? r.fireAt()
            : CronTimes.next(r.cronExpression(), zone, Instant.now());

        job.updateDetails(
            r.name(),
            r.type(),
            r.cronExpression(),
            r.payload(),
            zone,
            next,
            r.priority(),
            r.maxRuntimeSeconds(),
            r.misfirePolicy()
        );

        return JobResponse.from(jobs.save(job));
    }

   @Transactional
public void pauseJob(String tenant, UUID id) {
    ScheduledJob job = findJob(tenant, id)
        .orElseThrow(() -> new NoSuchElementException("Job not found"));

    if (job.getStatus() != JobStatus.ACTIVE) {
        throw new IllegalStateException("Only active jobs can be paused");
    }

    job.setStatus(JobStatus.PAUSED);
    jobs.save(job);
}

@Transactional
public void resumeJob(String tenant, UUID id) {
    ScheduledJob job = findJob(tenant, id)
        .orElseThrow(() -> new NoSuchElementException("Job not found"));

    if (job.getStatus() != JobStatus.PAUSED) {
        throw new IllegalStateException("Only paused jobs can be resumed");
    }

    job.setStatus(JobStatus.ACTIVE);
    jobs.save(job);
}
    @Transactional
    public void tenantStatus(String tenant, JobStatus status) {
        jobs.updateTenantStatus(
            tenant,
            status,
            List.of(JobStatus.ACTIVE, JobStatus.PAUSED)
        );
    }

    private Optional<ScheduledJob> findJob(String tenant, UUID id) {
        return jobs.findByIdAndTenantId(id, tenant);
    }

    private void validateSchedule(
        JobType type,
        String cronExpression,
        Instant fireAt
    ) {
        if (type == JobType.ONE_OFF && fireAt == null) {
            throw new IllegalArgumentException(
                "fireAt is required for one-off jobs"
            );
        }

        if (type == JobType.CRON &&
            (cronExpression == null || cronExpression.isBlank())) {
            throw new IllegalArgumentException(
                "cronExpression is required for recurring jobs"
            );
        }
    }


    @Transactional
public void deleteJob(UUID id, String tenantId) {
    ScheduledJob job = jobs
        .findByIdAndTenantId(id, tenantId)
        .orElseThrow(() -> new RuntimeException("Job not found"));

    if (job.getStatus() == JobStatus.CANCELLED) {
        throw new RuntimeException("Job is already cancelled");
    }

    job.setStatus(JobStatus.CANCELLED);
    jobs.save(job);
}

    
}