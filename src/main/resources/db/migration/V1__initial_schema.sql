create table scheduled_jobs (
 id uuid primary key,
 tenant_id varchar(100) not null,
 name varchar(160) not null,
 type varchar(20) not null,
 cron_expression varchar(160),
 payload text not null,
 zone_id varchar(80) not null,
 next_fire_at timestamptz,
 priority integer not null,
 max_runtime_seconds integer not null,
 misfire_policy varchar(20) not null,
 status varchar(20) not null,
 partition_id integer not null,
 created_at timestamptz not null,
 version bigint not null default 0
);
create index idx_jobs_due on scheduled_jobs(status,next_fire_at);
create index idx_jobs_tenant on scheduled_jobs(tenant_id,status);
create table job_runs (
 id uuid primary key,
 job_id uuid not null references scheduled_jobs(id),
 tenant_id varchar(100) not null,
 idempotency_key varchar(200) not null,
 scheduled_at timestamptz not null,
 started_at timestamptz,
 finished_at timestamptz,
 status varchar(20) not null,
 attempts integer not null,
 fencing_token bigint not null,
 last_error varchar(500),
 created_at timestamptz not null,
 constraint uk_run_idempotency unique(idempotency_key)
);
create index idx_runs_status on job_runs(status,created_at);
create table outbox_events (
 id uuid primary key,
 aggregate_type varchar(120) not null,
 aggregate_id varchar(120) not null,
 event_type varchar(100) not null,
 payload text not null,
 created_at timestamptz not null,
 published_at timestamptz
);
create index idx_outbox_published on outbox_events(published_at,created_at);
