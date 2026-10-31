package com.moveinsync.scheduler.service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.List;
@Service
public class LeaseService {
 private final StringRedisTemplate redis; private final DefaultRedisScript<Long> script;
 public LeaseService(StringRedisTemplate redis,DefaultRedisScript<Long> script){this.redis=redis;this.script=script;}
 public long acquireOrRenew(int partition,String owner,Duration ttl){
  String counter="scheduler:fence:"+partition, lease="scheduler:lease:"+partition;
  Long token=redis.execute(script,List.of(counter,lease),owner,String.valueOf(ttl.toMillis()));
  return token==null?-1:token;
 }
 public boolean owns(int partition,String owner){
  return owner.equals(redis.opsForValue().get("scheduler:lease:"+partition));
 }
 public boolean release(int partition,String owner){
  String key="scheduler:lease:"+partition;
  String lua="if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end";
  Long n=redis.execute(new DefaultRedisScript<>(lua,Long.class),List.of(key),owner);
  return n!=null&&n==1;
 }
}
