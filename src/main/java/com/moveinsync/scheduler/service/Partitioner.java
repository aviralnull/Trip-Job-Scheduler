package com.moveinsync.scheduler.service;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.zip.CRC32;
import org.springframework.stereotype.Component;
@Component
public class Partitioner {
 public static final int PARTITIONS=256;
 public int partition(String tenantId,UUID jobId){
  CRC32 crc=new CRC32(); crc.update((tenantId+":"+jobId).getBytes(StandardCharsets.UTF_8));
  return (int)(crc.getValue()%PARTITIONS);
 }
}
