package com.moveinsync.scheduler.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="job_runs", uniqueConstraints=@UniqueConstraint(name="uk_run_idempotency", columnNames="idempotency_key"),
 indexes=@Index(name="idx_runs_status", columnList="status,created_at"))
public class JobRun {
 @Id @GeneratedValue private UUID id;
 @Column(name="job_id",nullable=false) private UUID jobId;
 @Column(name="tenant_id",nullable=false,length=100) private String tenantId;
 @Column(name="idempotency_key",nullable=false,length=200) private String idempotencyKey;
 @Column(name="scheduled_at",nullable=false) private Instant scheduledAt;
 @Column(name="started_at") private Instant startedAt;
 @Column(name="finished_at") private Instant finishedAt;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private RunStatus status=RunStatus.QUEUED;
 @Column(nullable=false) private int attempts=0;
 @Column(name="fencing_token",nullable=false) private long fencingToken=0;
 @Column(name="last_error",length=500) private String lastError;
 @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now();
 protected JobRun(){}
 public JobRun(UUID jobId,String tenantId,String key,Instant scheduledAt){this.jobId=jobId;this.tenantId=tenantId;this.idempotencyKey=key;this.scheduledAt=scheduledAt;}
 public UUID getId(){return id;} public UUID getJobId(){return jobId;} public String getTenantId(){return tenantId;}
 public String getIdempotencyKey(){return idempotencyKey;} public Instant getScheduledAt(){return scheduledAt;}
 public RunStatus getStatus(){return status;} public int getAttempts(){return attempts;}
 public long getFencingToken(){return fencingToken;}
 public void start(long token){status=RunStatus.RUNNING;startedAt=Instant.now();fencingToken=token;attempts++;}
 public void succeed(){status=RunStatus.SUCCEEDED;finishedAt=Instant.now();}
 public void retry(String error){status=RunStatus.RETRYING;lastError=error;}
 public void dead(String error){status=RunStatus.DEAD;lastError=error;finishedAt=Instant.now();}
 public Instant getStartedAt() {
    return startedAt;
}

public Instant getFinishedAt() {
    return finishedAt;
}

public String getLastError() {
    return lastError;
}

public Instant getCreatedAt() {
    return createdAt;
}
}
