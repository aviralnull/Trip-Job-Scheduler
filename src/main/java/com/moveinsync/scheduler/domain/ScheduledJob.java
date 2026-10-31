package com.moveinsync.scheduler.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.ZoneId;
import java.util.UUID;

@Entity @Table(name="scheduled_jobs", indexes={
 @Index(name="idx_jobs_due", columnList="status,next_fire_at"),
 @Index(name="idx_jobs_tenant", columnList="tenant_id,status")})
public class ScheduledJob {
 @Id @GeneratedValue private UUID id;
 @Column(name="tenant_id", nullable=false, length=100) private String tenantId;
 @Column(nullable=false, length=160) private String name;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private JobType type;
 @Column(name="cron_expression") private String cronExpression;
 @Column(name="payload", columnDefinition="text", nullable=false) private String payload;
 @Column(name="zone_id", nullable=false) private String zoneId;
 @Column(name="next_fire_at") private Instant nextFireAt;
 @Column(nullable=false) private int priority;
 @Column(name="max_runtime_seconds", nullable=false) private int maxRuntimeSeconds;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private MisfirePolicy misfirePolicy;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private JobStatus status=JobStatus.ACTIVE;
 @Column(name="partition_id", nullable=false) private int partitionId;
 @Column(name="created_at", nullable=false) private Instant createdAt=Instant.now();
 @Version private long version;

 protected ScheduledJob() {}
 public ScheduledJob(String tenantId,String name,JobType type,String cronExpression,String payload,
                     ZoneId zoneId,Instant nextFireAt,int priority,int maxRuntimeSeconds,
                     MisfirePolicy misfirePolicy,int partitionId) {
  this.tenantId=tenantId; this.name=name; this.type=type; this.cronExpression=cronExpression;
  this.payload=payload; this.zoneId=zoneId.getId(); this.nextFireAt=nextFireAt;
  this.priority=priority; this.maxRuntimeSeconds=maxRuntimeSeconds;
  this.misfirePolicy=misfirePolicy; this.partitionId=partitionId;
 }
 public UUID getId(){return id;} public String getTenantId(){return tenantId;}
 public String getName(){return name;} public JobType getType(){return type;}
 public String getCronExpression(){return cronExpression;} public String getPayload(){return payload;}
 public ZoneId getZoneId(){return ZoneId.of(zoneId);} public Instant getNextFireAt(){return nextFireAt;}
 public int getPriority(){return priority;} public int getMaxRuntimeSeconds(){return maxRuntimeSeconds;}
 public MisfirePolicy getMisfirePolicy(){return misfirePolicy;} public JobStatus getStatus(){return status;}
 public int getPartitionId(){return partitionId;} public long getVersion(){return version;}
 public void setNextFireAt(Instant value){this.nextFireAt=value;}
 public void setStatus(JobStatus value){this.status=value;}
 public Instant getCreatedAt(){return createdAt;}
}
