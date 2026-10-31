package com.moveinsync.scheduler.config;
import org.springframework.context.annotation.*;
import org.springframework.data.redis.core.script.DefaultRedisScript;
@Configuration
public class RedisConfig {
 @Bean DefaultRedisScript<Long> fencingScript(){
  var script=new DefaultRedisScript<Long>();
  script.setScriptText("local t=redis.call('INCR',KEYS[1]); redis.call('SET',KEYS[2],ARGV[1],'PX',ARGV[2]); return t");
  script.setResultType(Long.class); return script;
 }
}
