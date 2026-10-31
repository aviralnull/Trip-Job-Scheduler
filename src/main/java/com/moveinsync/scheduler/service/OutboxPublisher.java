package com.moveinsync.scheduler.service;
import com.moveinsync.scheduler.repository.OutboxRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
@Component
public class OutboxPublisher {
 private final OutboxRepository outbox; private final KafkaTemplate<String,String> kafka;
 public OutboxPublisher(OutboxRepository outbox,KafkaTemplate<String,String> kafka){this.outbox=outbox;this.kafka=kafka;}
 @Scheduled(fixedDelayString="${scheduler.outbox-poll-ms:250}")
 @Transactional public void publish(){
  for(var event:outbox.lockUnpublished()){
   try{
    kafka.send("job-executions",event.getAggregateId(),event.getPayload()).get();
    event.markPublished();
   }catch(Exception ignored){ /* leave unpublished; next poll retries */ }
  }
 }
}
