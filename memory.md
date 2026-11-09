# Memory: JobPilot feature 4 database schema

Last updated: 2026-11-08

## What was built

Created and applied the database foundation for feature 4.

Files added:

* `migrations/20261108223800_create-jobpilot-schema.sql`
* `migrations/20261108224003_harden-resume-storage-policies.sql`
* `docs/specs/0001-database-schema.md`
* `docs/scope/scope.md`

The live InsForge project now has `profiles`, `agent_runs`, `jobs`, and `agent_logs`, with indexes, constraints, owner scoped relational row level security, composite same owner references, and append only runtime logs. The private `resumes` bucket exists with owner scoped storage policies.

## Decisions made

* Use versioned InsForge migrations for schema and policy changes.
* Keep resumes private. Application code uses `{user_id}/resume.pdf` and stores both the returned URL and key.
* Use database constraints and row level security as defense in depth.
* Allow repeated job rows across discovery runs.
* Job deletion cascades related agent logs.
* Storage cleanup is an explicit future account deletion workflow, not a relational cascade.
* Tailored job fields remain out of scope because the product does not define them yet.

## Problems solved

Creating the private bucket added broad default storage policies. The corrective migration removes those defaults so only the owner scoped resume policies remain. Live inspection confirmed the four application tables, constraints, indexes, row level security, storage policies, private bucket, and both migrations.

## Current state

Feature 4 is still in progress. The first three build milestones are complete and recorded in `docs/scope/scope.md`. The final behavioral checks for ownership, cross owner references, invalid values, cascades, storage access, and append only logs are still pending. The spec is accepted and reconciled with the applied implementation.

The existing edit in `context/progress-tracker.md` belongs to the user and was preserved.

## Next session starts with

Run `/develop Database Schema` to resume the final behavioral checks. Then run `/check verify Database Schema` and `/test Database Schema`.

## Open questions

* The account deletion workflow still needs to remove the stored resume object with retry handling.
* The profile feature should choose the signed URL expiry when resume preview is implemented.
* The build plan wording about tailored fields should be reconciled before resume tailoring is considered.
