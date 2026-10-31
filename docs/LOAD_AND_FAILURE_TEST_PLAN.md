# Load and failure test plan

## Required benchmark
Seed 100,000 jobs with due times distributed across a 10-minute interval. Run three application nodes and record machine CPU/RAM, PostgreSQL and Redis versions, Kafka partitions, concurrency and dataset size. Report throughput plus p50/p95/p99 fire lag. Target: p99 under 2 seconds.

## Failure injections
* `docker kill <worker-container>` while a batch is executing; verify pending runs recover and no duplicate side effect occurs.
* `docker pause <worker-container>` for 30 seconds, then unpause; verify stale fencing token is rejected by the side-effect store.
* Stop Kafka; verify outbox backlog increases and drains after restart.
* Stop Redis; verify workers fail closed rather than executing without a valid lease.
* Publish the same Kafka message twice and out of order; verify stable idempotency keys and terminal-state checks.

## Acceptance evidence
Attach test logs, Grafana/Prometheus snapshots, exact command lines, host specs, throughput and latency percentiles. Do not claim the target passes without actual results.
