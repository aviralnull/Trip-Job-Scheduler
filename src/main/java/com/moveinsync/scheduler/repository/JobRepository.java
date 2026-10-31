package com.moveinsync.scheduler.repository;
import com.moveinsync.scheduler.domain.*;

import org.springframework.boot.autoconfigure.batch.BatchProperties.Job;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.*;
public interface JobRepository extends JpaRepository<ScheduledJob,UUID> {
 List<ScheduledJob> findTop500ByStatusAndNextFireAtLessThanEqualOrderByPriorityDescNextFireAtAsc(JobStatus status,Instant now);
Optional<ScheduledJob> findByIdAndTenantId(UUID id, String tenantId);
 List<ScheduledJob> findByTenantIdAndStatus(String tenantId,JobStatus status);
 @Modifying @Query("update ScheduledJob j set j.status=:status where j.tenantId=:tenant")
 int updateTenantStatus(@Param("tenant") String tenant,@Param("status") JobStatus status);
}
