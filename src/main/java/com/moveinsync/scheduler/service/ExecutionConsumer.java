package com.moveinsync.scheduler.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moveinsync.scheduler.repository.JobRunRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
@Component
public class ExecutionConsumer {
 private final JobRunRepository runs; private final LeaseService leases; private final ObjectMapper mapper;
 public ExecutionConsumer(JobRunRepository runs,LeaseService leases,ObjectMapper mapper){this.runs=runs;this.leases=leases;this.mapper=mapper;}
 @KafkaListener(topics="job-executions",groupId="trip-job-workers")
 @Transactional public void consume(String message) throws Exception {
  JsonNode e=mapper.readTree(message); UUID runId=UUID.fromString(e.get("runId").asText());
  int partition=e.get("partitionId").asInt(); var run=runs.findById(runId).orElseThrow();
  if(run.getStatus()==com.moveinsync.scheduler.domain.RunStatus.SUCCEEDED) return;
  String owner=System.getenv().getOrDefault("WORKER_ID","worker-local");
  long token=leases.acquireOrRenew(partition,owner,java.time.Duration.ofSeconds(15));
  if(token<0) throw new IllegalStateException("Partition lease unavailable");
  run.start(token);
  // Replace this placeholder with the actual idempotent side-effect adapter.
  // The downstream system must persist idempotencyKey and reject stale fencing tokens.
  run.succeed();
 }
}
