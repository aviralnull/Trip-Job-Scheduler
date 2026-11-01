package com.moveinsync.scheduler.repository;

import com.moveinsync.scheduler.domain.JobRun;
import com.moveinsync.scheduler.domain.RunStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface JobRunRepository extends JpaRepository<JobRun, UUID> {

    Optional<JobRun> findByIdempotencyKey(String key);

    long countByStatus(RunStatus status);

    List<JobRun> findTop100ByTenantIdOrderByCreatedAtDesc(String tenantId);

    List<JobRun> findTop200ByJobIdAndTenantIdOrderByCreatedAtDesc(
        UUID jobId,
        String tenantId
    );

    long countByTenantIdAndStatus(String tenantId, RunStatus status);
}