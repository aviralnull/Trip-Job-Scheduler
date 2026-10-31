package com.moveinsync.scheduler.repository;
import com.moveinsync.scheduler.domain.OutboxEvent;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;
public interface OutboxRepository extends JpaRepository<OutboxEvent,UUID> {
 @Query(value="select * from outbox_events where published_at is null order by created_at limit 200 for update skip locked",nativeQuery=true)
 List<OutboxEvent> lockUnpublished();
}
