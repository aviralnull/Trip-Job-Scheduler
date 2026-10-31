package com.moveinsync.scheduler.service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
@Component
public class SchedulerLoop {
 private final DispatchService dispatch;
 public SchedulerLoop(DispatchService dispatch){this.dispatch=dispatch;}
 @Scheduled(fixedDelayString="${scheduler.dispatch-poll-ms:100}")
 public void tick(){dispatch.dispatchDue();}
}
