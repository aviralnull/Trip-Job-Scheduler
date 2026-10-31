# Design Note

## Components
REST/API validates requests and scopes all job access to the authenticated tenant. JobService persists definitions. SchedulerLoop scans due work and writes JobRun + OutboxEvent in one PostgreSQL transaction. OutboxPublisher relays events to Kafka. Workers acquire partition leases in Redis, obtain fencing tokens and execute idempotent handlers. PostgreSQL retains durable execution state.

## Hardest flow: dispatch and execution
1. Scheduler selects due rows using the `(status,next_fire_at)` index.
2. It inserts a run with deterministic idempotency key. The unique constraint collapses concurrent duplicate scheduling.
3. It inserts an outbox event in the same transaction.
4. Publisher sends to Kafka and marks the outbox row published. A crash can cause duplicate publication.
5. Consumer checks run state, obtains partition lease and a fencing token.
6. Handler performs side effect using the idempotency key and rejects fencing tokens older than the latest accepted token.
7. Run becomes SUCCEEDED. Duplicate Kafka records see terminal state and return.

## Failure-mode table
| Failure | Observable behavior | Recovery |
|---|---|---|
| Scheduler process killed | Due jobs remain in PostgreSQL | Another scheduler scans due index |
| Publisher dies before send | Outbox remains unpublished | Poller retries |
| Publisher dies after send | Duplicate Kafka event possible | Consumer idempotency |
| Worker killed | Run remains nonterminal | Lease expiry and run reaper retry |
| Worker resumes after lease expiry | Stale token rejected by sink | Re-read lease/token; do not commit |
| Redis unavailable | New lease acquisition fails closed | Retry after Redis recovery |
| Kafka unavailable | Outbox backlog grows | Publisher resumes when broker returns |
| Tenant floods queue | Must be throttled by tenant semaphore | Fair queue and concurrency cap |

## Consistency, availability, latency
The design fails closed when lease authority cannot be established. This sacrifices some availability to protect against concurrent side effects. The database is the due-time authority in UTC; hosts must use NTP and alert on clock drift. Redis lease TTL is not a correctness proof by itself: the downstream sink must validate fencing tokens.

## Deliberately out of scope for this starter
Multi-region active-active, exactly-once arbitrary external side effects, a full operator UI, adaptive partition count, and a production-grade tenant identity provider.
