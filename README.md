# Distributed Trip Job Scheduler

Java 21 / Spring Boot implementation starter for the MoveInSync Case Study 3.

## Architecture and guarantees

* PostgreSQL is the durable source of truth for jobs, run records and the transactional outbox.
* Redis provides partition lease coordination, monotonic fencing counters and a place for hot scheduling indexes/cache.
* Kafka transports job execution events. Consumers must be idempotent because delivery is at least once.
* `job_runs.idempotency_key` uniquely identifies a scheduled occurrence (`jobId:scheduledEpochMillis`).
* The outbox closes the database-write/Kafka-publish dual-write gap. The publisher can publish a duplicate if it crashes after Kafka acknowledgement but before marking the row; consumers must deduplicate.
* A fencing token is useful only if the side-effect destination validates it. Redis lease ownership alone cannot stop a paused process from writing to an unrelated external system.

## Important implementation status

This repository is a runnable foundation, not a completed proof of every advanced-track requirement. Before claiming production-grade guarantees, complete the TODOs in `ExecutionConsumer` and `LeaseService`, and implement:
1. A proper JWT authentication filter and tenant identity claim. The included HTTP Basic security is a development placeholder.
2. Atomic compare-and-set lease renewal/acquisition with owner identity, monotonically increasing fencing tokens and partition ownership checks. Current lease helper illustrates the primitives but needs a production ownership protocol.
3. Fencing validation at the side-effect boundary and durable idempotency in the downstream notification/billing adapter.
4. Per-tenant concurrency semaphores/queues, fair dispatch, retry scheduler with exponential backoff + jitter, dead-letter replay, manual trigger, next-fire preview and misfire handling.
5. Cron overlap/gap policy tests and complete misfire semantics.
6. Multi-node partition rebalancing and a proper distributed clock strategy. Use database UTC time as the due-time authority; monitor node clock drift with NTP.
7. Metrics for fire lag histogram, running/retrying/dead counts, queue depth, lease loss, stale fencing rejection and tenant throttling.
8. Load/failure tests for 100,000 jobs / 10 minutes, `kill -9`, `SIGSTOP`, duplicate/out-of-order Kafka delivery and three-node failover.

Do not represent the case-study target (p99 lag <2s) as achieved until measured on a documented machine and workload.

## Run locally

Prerequisites: Docker Compose, Java 21, Maven 3.9+.

```bash
docker compose up -d
mvn spring-boot:run
```

Health: `http://localhost:8080/actuator/health`  
Prometheus: `http://localhost:8080/actuator/prometheus`  
Prometheus UI: `http://localhost:9090`

The compose file starts PostgreSQL, Redis, Kafka and Prometheus. Run the Spring Boot application locally in a separate terminal. For a containerized app, build with `docker build -t trip-scheduler .` and add an app service to Compose after infrastructure is healthy.

## API examples

The current development security uses HTTP Basic. The default local username/password are Spring Security generated unless you configure users; configure a proper user store/JWT before using the API.

Create one-off job:
```bash
curl -u demo:password -X POST http://localhost:8080/api/v1/jobs \
 -H 'Content-Type: application/json' \
 -d '{"name":"pickup-alert","type":"ONE_OFF","payload":"{\"tripId\":\"trip-123\"}","zoneId":"Asia/Kolkata","fireAt":"2026-10-31T08:00:00Z","priority":10,"maxRuntimeSeconds":30,"misfirePolicy":"FIRE_NOW"}'
```

Create recurring job:
```json
{
  "name": "daily-roster",
  "type": "CRON",
  "cronExpression": "0 0 22 * * *",
  "payload": "{\"action\":\"generate-roster\"}",
  "zoneId": "Asia/Kolkata",
  "priority": 5,
  "maxRuntimeSeconds": 300,
  "misfirePolicy": "COALESCE"
}
```

## DST policy to document and enforce

Use tenant `ZoneId`, never the server default zone. A nonexistent local time during a spring-forward gap (e.g. 02:30) is skipped to the next matching cron occurrence. For an overlap (e.g. 01:30 occurs twice), define a single occurrence per local scheduled date and choose the earlier offset; persist the resolved `Instant` so restarts do not recalculate a different occurrence. Add explicit tests before enabling cron workloads across DST regions.

## Complexity and capacity model

* Job creation: O(1) average hash partition assignment; database insert O(log N) for indexed structures.
* Due scan: O(log N + B) with a suitable ordered due index, where B is the batch size. This starter's query uses an indexed timestamp/status range.
* Run deduplication: O(log R) unique-index lookup/insert.
* Partition ownership: O(P) total ownership state for P partitions; steady-state claim is O(1) per partition.
* Space: O(J + R + O) for jobs, retained runs and outbox events. Apply retention/archival to completed runs and published outbox records.

A 100k/10m target averages 166.7 due jobs/s, but burst shape matters. Three nodes need measured headroom for retries, DB commit latency, Kafka lag and tenant caps. Benchmark p50/p99 on the actual deployment; no benchmark result is fabricated in this repository.

## Package structure

```text
src/main/java/com/moveinsync/scheduler/
  api/                 REST controllers and global exception mapping
  api/dto/              request/response contracts
  config/               Spring, Redis, Kafka and security configuration
  domain/               JPA entities and state enums
  repository/           persistence interfaces
  service/              partitioning, dispatch, leases, cron, outbox and workers
src/main/resources/
  db/migration/         Flyway schema
  redis/                Redis Lua scripts
src/test/java/          unit and integration tests
monitoring/              Prometheus scrape configuration
```

## Trade-offs

* PostgreSQL gives durable state and transactional uniqueness; Redis and Kafka are coordination/transport layers, not the only copy of job state.
* The outbox favors consistency over the lowest possible dispatch latency.
* At-least-once Kafka delivery is accepted; effects are deduplicated at the destination.
* A fixed partition count (256) simplifies scheduling but rebalancing needs an explicit ownership protocol.
* Single-broker Compose is for development only, not production availability.
