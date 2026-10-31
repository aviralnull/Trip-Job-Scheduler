package com.moveinsync.scheduler.service;
import org.junit.jupiter.api.Test;
import java.time.*;
import static org.junit.jupiter.api.Assertions.*;
class CronTimesTest {
 @Test void cronRunsInTenantZone(){
  Instant next=CronTimes.next("0 30 9 * * *",ZoneId.of("Asia/Kolkata"),Instant.parse("2026-01-01T00:00:00Z"));
  assertEquals(Instant.parse("2026-01-01T04:00:00Z"),next);
 }
 @Test void invalidCronIsRejected(){assertThrows(IllegalArgumentException.class,()->CronTimes.next("not-cron",ZoneId.of("UTC"),Instant.now()));}
}
