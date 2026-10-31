package com.moveinsync.scheduler.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moveinsync.scheduler.domain.*;
import com.moveinsync.scheduler.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;
@Service
public class DispatchService {
 private final JobRepository jobs; private final JobRunRepository runs; private final OutboxRepository outbox; private final ObjectMapper mapper;
 public DispatchService(JobRepository jobs,JobRunRepository runs,OutboxRepository outbox,ObjectMapper mapper){this.jobs=jobs;this.runs=runs;this.outbox=outbox;this.mapper=mapper;}
 @Transactional public int dispatchDue(){
  var due=jobs.findTop500ByStatusAndNextFireAtLessThanEqualOrderByPriorityDescNextFireAtAsc(JobStatus.ACTIVE,Instant.now());
  int count=0;
  for(var job:due){
   Instant scheduled=job.getNextFireAt();
   String key=job.getId()+":"+scheduled.toEpochMilli();
   if(runs.findByIdempotencyKey(key).isEmpty()){
    var run=new JobRun(job.getId(),job.getTenantId(),key,scheduled); runs.save(run);
    try{
     String payload=mapper.writeValueAsString(Map.of("runId",run.getId(),"jobId",job.getId(),"tenantId",job.getTenantId(),"idempotencyKey",key,"scheduledAt",scheduled.toString(),"partitionId",job.getPartitionId()));
     outbox.save(new OutboxEvent("JOB",job.getId().toString(),"JOB_DUE",payload));
    }catch(Exception e){throw new IllegalStateException("Could not serialize job event");}
    count++;
   }
   if(job.getType()==JobType.ONE_OFF) job.setStatus(JobStatus.COMPLETED);
   else job.setNextFireAt(CronTimes.next(job.getCronExpression(),job.getZoneId(),scheduled));
  }
  return count;
 }
}
