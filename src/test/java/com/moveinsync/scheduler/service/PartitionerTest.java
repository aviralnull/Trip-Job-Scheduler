package com.moveinsync.scheduler.service;
import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
class PartitionerTest {
 @Test void partitionIsStableAndBounded(){
  var p=new Partitioner(); var id=UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
  assertEquals(p.partition("tenant-a",id),p.partition("tenant-a",id));
  assertTrue(p.partition("tenant-a",id)>=0 && p.partition("tenant-a",id)<256);
 }
}
