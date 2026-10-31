Worker adapters belong here. Implement an interface such as `JobHandler` with typed handlers for alerts,
roster generation, no-show cancellation and billing. Every handler must accept idempotency key + fencing
token and enforce both at the side-effect destination.
