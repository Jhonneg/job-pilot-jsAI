# Scope: JobPilot

JobPilot helps technical job seekers find relevant roles, understand their match, and prepare for applications.

**Build approach:** Facade (build visible surfaces first, then connect real data in focused slices).
**Workflow:** Beta (run verification, then tests after development).

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 4 | Database Schema | Foundation | in-progress |

## Foundation

### 4. Database Schema · in-progress

Create the durable tables, ownership rules, indexes, and private resume storage needed by the later profile, job discovery, research, and dashboard features.
**Done when:** the four tables, their constraints and row level security, the private resumes bucket, the required indexes, and relational deletion behavior are applied and verified.
- [x] Design it (spec): `/architect Database Schema`
- [ ] Build it: `/develop Database Schema`
   - [x] Create schema and integrity rules, including tables, fields, defaults, relationships, checks, and indexes (AC-1, AC-2, AC-5)
   - [x] Apply relational and storage row level security, grants, and ownership protections (AC-3, AC-4)
   - [x] Apply the migration and bucket setup, then inspect the live configuration and rollback boundary (AC-4, AC-7)
   - [ ] Run ownership, cross owner reference, cascade, storage access, and append only checks (AC-2, AC-3, AC-4, AC-6)
- [ ] Verify it: `/check verify Database Schema`
- [ ] Test it: `/test Database Schema`
Spec [0001](../specs/0001-database-schema.md) · code in `migrations/`

## Deferred

The remaining product features are tracked in `context/build-plan.md` and can be enrolled as they are designed.

## Legend

Feature status moves from planned to in-progress to done as the work is designed, built, verified, and tested. The spec contains the atomic build tasks. This scope keeps only milestone level work.
