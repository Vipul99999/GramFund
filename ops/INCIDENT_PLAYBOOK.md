# Incident Playbook

## Payment flow failures
1. Check API health and error rate.
2. Validate DB and Redis connectivity.
3. Inspect duplicate/idempotency rejection spikes.
4. Confirm worker is consuming queue.
5. If needed, pause intake and replay failed jobs after mitigation.

## Queue backlog growth
1. Check queue depth and worker concurrency.
2. Inspect dead-letter/failure reasons.
3. Scale workers temporarily.
4. Capture root-cause ticket and prevention action.
