package com.moveinsync.scheduler.repository;

import com.moveinsync.scheduler.domain.JobRun;
import com.moveinsync.scheduler.domain.RunStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobRunRepository extends JpaRepository<JobRun, UUID> {

    Optional<JobRun> findByIdempotencyKey(String key);

    long countByStatus(RunStatus status);

    List<JobRun> findTop100ByTenantIdOrderByCreatedAtDesc(String tenantId);

    long countByTenantIdAndStatus(String tenantId, RunStatus status);
}