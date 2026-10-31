package com.moveinsync.scheduler.service;
import org.springframework.scheduling.support.CronExpression;
import java.time.*;
public final class CronTimes {
 private CronTimes(){}
 public static Instant next(String expression,ZoneId zone,Instant after){
  CronExpression cron=CronExpression.parse(expression);
  ZonedDateTime local=after.atZone(zone);
  // Spring's zone-aware ZonedDateTime cron evaluation defines DST behavior:
  // nonexistent local times are skipped to the next valid matching time; overlaps resolve on the timeline.
  return cron.next(local).toInstant();
 }
}
