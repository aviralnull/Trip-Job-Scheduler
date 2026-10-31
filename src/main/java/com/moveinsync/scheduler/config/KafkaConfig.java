package com.moveinsync.scheduler.config;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.*;
import org.springframework.kafka.config.TopicBuilder;
@Configuration
public class KafkaConfig {
 @Bean NewTopic jobExecutionTopic(){return TopicBuilder.name("job-executions").partitions( twelve()).replicas(1).build();}
 private int twelve(){return 12;}
}
