package com.moveinsync.scheduler.domain;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="outbox_events", indexes=@Index(name="idx_outbox_published",columnList="published_at,created_at"))
public class OutboxEvent {
 @Id @GeneratedValue private UUID id;
 @Column(nullable=false,length=120) private String aggregateType;
 @Column(nullable=false,length=120) private String aggregateId;
 @Column(nullable=false,length=100) private String eventType;
 @Column(nullable=false,columnDefinition="text") private String payload;
 @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now();
 @Column(name="published_at") private Instant publishedAt;
 protected OutboxEvent(){}
 public OutboxEvent(String type,String aggregateId,String eventType,String payload){this.aggregateType=type;this.aggregateId=aggregateId;this.eventType=eventType;this.payload=payload;}
 public UUID getId(){return id;} public String getPayload(){return payload;} public String getEventType(){return eventType;}
 public String getAggregateId(){return aggregateId;} public Instant getPublishedAt(){return publishedAt;}
 public void markPublished(){publishedAt=Instant.now();}
}
