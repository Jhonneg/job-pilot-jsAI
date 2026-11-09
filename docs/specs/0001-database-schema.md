# 0001. Create the JobPilot database schema

**Date**: 2026-11-08
**Status**: Accepted

## Summary

This decision creates the database foundation for JobPilot. It adds the four user owned tables, their integrity rules, row level security, useful indexes, and a private resume storage bucket. Later features can safely save profiles, discovery runs, jobs, and logs without inventing their own data rules.

## Context

JobPilot currently has authentication and page scaffolds, but it has no application tables or storage contract. Profile editing, job discovery, company research, and dashboard analytics all need durable records with consistent ownership.

The records contain personal information, resume documents, job history, and operational logs. Every runtime query must be isolated to the signed in account. The schema also needs to support repeated discovery runs, optional company research, and future list views without relying only on application code.

> ⚠️ Premise note: The build plan mentions tailored job fields, but the architecture does not define those fields and resume tailoring is out of scope. This spec creates only the documented fields. Adding unused columns now would create an unclear contract and future cleanup work.

## Requirements

**User stories**:

* As a signed in job seeker, I want my profile, jobs, runs, and logs stored under my account so that my data stays available and private.
* As the application, I want stable database rules for jobs, discovery runs, and logs so that later features can write consistent records.

**Acceptance criteria**:

* **AC-1**: A versioned migration sequence creates `profiles`, `agent_runs`, `jobs`, and `agent_logs` in the public schema with the column contract, relationships, defaults, and nullability defined in this spec.
* **AC-2**: Database constraints reject null or invalid source values, run statuses, log levels, negative counts, and match scores outside 0 through 100.
* **AC-3**: Authenticated users can read and manage only their own profile, runs, and jobs. They can read their own logs and append logs, while ownership fields remain protected and cross user references are rejected.
* **AC-4**: A private `resumes` bucket exists. Application code uses the exact object key `{user_id}/resume.pdf`, and storage policies allow only the owning authenticated user to upload, replace, read, list, or delete objects in that user's folder.
* **AC-5**: Indexes support owner scoped job ordering by score and found time, run lookup, owner scoped log chronology, and research activity lookup.
* **AC-6**: Deleting a profile removes its relational records through database cascades. Storage object cleanup is explicitly owned by the later account deletion workflow and is not claimed as an automatic database cascade.
* **AC-7**: A failed SQL migration rolls back its database changes, while bucket creation is verified separately because it is an external CLI operation. The applied SQL state can be inspected through the InsForge CLI.

## Options considered

### Option 1: Versioned migration and private storage

Create a versioned SQL migration for the public tables, grants, policies, constraints, and indexes, followed by a corrective migration that removes broad storage policies added by bucket creation. Create the private storage bucket with the InsForge CLI. Keep all migration and verification steps in the repository workflow.

**Pros**:

* Repeatable and reviewable
* Keeps backend changes in source control
* Supports atomic migration behavior
* Matches the existing InsForge platform

**Cons**:

* Requires the team to apply migrations in the correct environment
* Storage bucket configuration is a separate CLI step

### Option 2: Direct SQL against the backend

Apply the schema with the database query command without a migration file.

**Pros**:

* Fast for a one time setup
* Useful for targeted repair work

**Cons**:

* Easy to lose or repeat the schema history
* Harder to reproduce in another environment
* Weakens review and rollback discipline

### Option 3: Public storage and application only validation

Create the tables with minimal constraints and make resume objects public, relying on route filters and application checks.

**Pros**:

* Simple initial client access
* Less database policy work

**Cons**:

* A missed query filter can expose another user's data
* Resume links can expose personal documents
* Invalid states can enter the database

## Decision

**Chosen option**: Option 1: Versioned migration and private storage

Create a versioned InsForge migration for the public schema and access rules, create the private `resumes` bucket with the InsForge CLI, then apply a corrective migration that removes broad default storage policies. Use database constraints and row level security as defense in depth, with application queries still scoped to the current user.

**Implementation skills**: `insforge-cli` (`insforge/insforge-cli`, `.agents/skills/insforge-cli/`)

## Rationale

The project already uses InsForge for authentication, database, and storage. A versioned migration sequence is the smallest durable change that can create all related tables, policies, grants, indexes, and constraints together while recording the storage policy correction discovered during live setup. It gives later developers a source controlled record instead of requiring them to reconstruct the backend from a live project.

Private storage is necessary because resumes contain personal information. Row level security protects relational data even when a future application query forgets an ownership filter. Direct SQL and public storage would make the first feature faster but would create avoidable operational and privacy risk.

The schema does not include tailored fields because no current product flow defines them and tailoring is out of scope. The build plan wording should be reconciled before that feature is considered. The storage policy follows the installed InsForge storage guidance, so the bucket name is `resumes` and the first key segment is the auth user id.

## Feature design

**Data model sketch**:

| Entity | Key fields | Relationships and rules |
|---|---|---|
| `profiles` | `id uuid` required, profile fields, timestamps | `id` references `auth.users(id)` with cascade delete. The id is supplied from the auth user, not generated independently. One profile per account. |
| `agent_runs` | `id uuid`, required `user_id`, required status, search inputs, nonnegative count, timestamps | `user_id` references `profiles(id)` with cascade delete. One profile has many runs. Status defaults to `running`, count defaults to zero, and `completed_at` is nullable. |
| `jobs` | `id uuid`, required `user_id`, nullable `run_id`, required source and listing identity, match fields, research JSON, `found_at`, nullable `company_researched_at` | `user_id` references `profiles(id)` with cascade delete. The composite `(run_id, user_id)` references the same owner run and cascades when a run is removed. URL source is reserved for future import. |
| `agent_logs` | `id uuid`, required `run_id`, required `user_id`, optional `job_id`, required message and level, timestamp | Composite `(run_id, user_id)` references the same owner run and cascades. Composite `(job_id, user_id)` references the same owner job and cascades when that job is removed. Runtime logs are append only. |
| `resumes` bucket | private object key `{user_id}/resume.pdf` | The profile flow enforces one active object and the fixed filename. Storage RLS checks the bucket and first key segment against the auth subject, so other files in the same owner folder remain owner private. |

Profile fields are `id`, `full_name`, `email`, `phone`, `location`, `current_title`, `experience_level`, `years_experience`, `skills`, `industries`, `work_experience`, `education`, `job_titles_seeking`, `remote_preference`, `preferred_locations`, `salary_expectation`, `cover_letter_tone`, `linkedin_url`, `portfolio_url`, `work_authorization`, `resume_pdf_url`, `resume_pdf_key`, `is_complete`, `created_at`, and `updated_at`. `email` is required. Collection fields default to empty arrays or an empty JSON object. `is_complete` defaults to false. All other profile fields are nullable until the profile save flow supplies them.

Job fields are `id`, `run_id`, `user_id`, `source`, `source_url`, `external_apply_url`, `title`, `company`, `location`, `salary`, `job_type`, `about_role`, `responsibilities`, `requirements`, `nice_to_have`, `benefits`, `about_company`, `match_score`, `match_reason`, `matched_skills`, `missing_skills`, `company_research`, `found_at`, and `company_researched_at`. `source`, `source_url`, `external_apply_url`, `title`, `company`, `location`, `match_score`, `matched_skills`, `missing_skills`, and `found_at` are required. `match_score` defaults to zero and the two skill arrays default to empty arrays. Other job detail fields are nullable.

`agent_runs.id`, `jobs.id`, and `agent_logs.id` use generated UUID values. `profiles.id` is the auth user UUID. Timestamps use database defaults. `updated_at` is maintained by the standard update trigger. `started_at` and `found_at` default to the current time. Optional text, JSON data, `run_id`, `job_id`, and `company_researched_at` values are nullable. The database does not enforce profile preference vocabularies or job type vocabulary beyond the required fields documented above. `is_complete` is maintained by the profile save flow from its required field rules, not by a database trigger.

The exact column contract is:

| Table | Column | Type | Required | Default or check |
|---|---|---|---|---|
| `profiles` | `id` | uuid | yes | references `auth.users(id)`, no generated default |
| `profiles` | `full_name`, `phone`, `location`, `current_title`, `experience_level`, `remote_preference`, `salary_expectation`, `cover_letter_tone`, `linkedin_url`, `portfolio_url`, `work_authorization`, `resume_pdf_url`, `resume_pdf_key` | text | no | none |
| `profiles` | `email` | text | yes | none |
| `profiles` | `years_experience` | integer | no | null or at least zero |
| `profiles` | `skills`, `industries`, `job_titles_seeking`, `preferred_locations` | text array | yes | empty array |
| `profiles` | `work_experience` | jsonb | yes | empty array |
| `profiles` | `education` | jsonb | yes | empty object |
| `profiles` | `is_complete` | boolean | yes | false |
| `profiles` | `created_at`, `updated_at` | timestamptz | yes | current time, `updated_at` trigger maintained |
| `agent_runs` | `id` | uuid | yes | generated UUID |
| `agent_runs` | `user_id` | uuid | yes | references `profiles(id)` with cascade delete |
| `agent_runs` | `status` | text | yes | `running`, `completed`, or `failed`, default `running` |
| `agent_runs` | `job_title_searched` | text | yes | none |
| `agent_runs` | `location_searched` | text | yes | empty string |
| `agent_runs` | `jobs_found` | integer | yes | zero, at least zero |
| `agent_runs` | `started_at` | timestamptz | yes | current time |
| `agent_runs` | `completed_at` | timestamptz | no | none |
| `jobs` | `id` | uuid | yes | generated UUID |
| `jobs` | `run_id` | uuid | no | nullable owner scoped reference to `agent_runs` |
| `jobs` | `user_id` | uuid | yes | references `profiles(id)` with cascade delete |
| `jobs` | `source` | text | yes | `search` or `url` |
| `jobs` | `source_url`, `external_apply_url`, `title`, `company`, `location` | text | yes | none |
| `jobs` | `salary`, `job_type`, `about_role`, `about_company`, `match_reason` | text | no | none |
| `jobs` | `responsibilities`, `requirements`, `nice_to_have`, `benefits` | text array | no | none |
| `jobs` | `match_score` | integer | yes | zero through 100, default zero |
| `jobs` | `matched_skills`, `missing_skills` | text array | yes | empty array |
| `jobs` | `company_research` | jsonb | no | none |
| `jobs` | `found_at` | timestamptz | yes | current time |
| `jobs` | `company_researched_at` | timestamptz | no | none |
| `agent_logs` | `id` | uuid | yes | generated UUID |
| `agent_logs` | `run_id` | uuid | yes | owner scoped reference to `agent_runs` with cascade delete |
| `agent_logs` | `user_id` | uuid | yes | references `profiles(id)` with cascade delete |
| `agent_logs` | `message` | text | yes | none |
| `agent_logs` | `level` | text | yes | `info`, `success`, `warning`, or `error`, default `info` |
| `agent_logs` | `job_id` | uuid | no | owner scoped reference to `jobs`, cascade delete |
| `agent_logs` | `created_at` | timestamptz | yes | current time |

**State transitions**:

`agent_runs.status` starts as `running` and the application agent changes it to `completed` or `failed`. The database requires a nonnull value from that set. `completed_at` remains null while running and is written by the agent when it reaches either terminal state. The database checks the vocabulary but does not enforce transition order.

The migration creates these indexes: `agent_runs_user_started_idx` on `(user_id, started_at desc, id desc)`, `jobs_user_score_idx` on `(user_id, match_score desc, id desc)`, `jobs_user_found_idx` on `(user_id, found_at desc, id desc)`, `jobs_user_researched_idx` on `(user_id, company_researched_at desc, id desc)`, `jobs_run_idx` on `(run_id)`, `agent_logs_user_created_idx` on `(user_id, created_at desc, id desc)`, and `agent_logs_run_idx` on `(run_id)`. The descending id tie breaker makes pagination stable. The research activity query explicitly uses `ORDER BY company_researched_at DESC NULLS LAST, id DESC`, so jobs without research are excluded from the leading activity results even though the index itself uses the database default null ordering.

**API surface**:

This feature adds no HTTP endpoint or server action. The migration and storage commands are the interface. Later feature routes and actions use the existing InsForge clients and the tables defined here.

| Interface | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| InsForge database migration | CLI apply | migration file | applied migration version | project administrator | invalid SQL, permission failure, dependency failure |
| InsForge storage bucket creation | CLI create bucket | bucket name, private flag | bucket configuration | project administrator | bucket already exists, permission failure |

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Create profile | account id and timestamps | authenticated user id and database defaults |
| Create discovery run | search title, location, status, count, timestamps | later agent input and database defaults |
| Save job | job fields and match fields | later Adzuna response, profile matching result, and agent run id |
| Save log | message, level, run, optional job | later agent operation and database defaults |
| Save resume reference | storage URL and object key | later InsForge storage upload response and the application enforced `{user_id}/resume.pdf` key |
| Enforce ownership | readable and writable rows | `auth.uid()` compared with the row owner id |

**Key invariants**:

* Every user owned row has an owner that resolves to the signed in account.
* A profile id is also the owning auth user id.
* `match_score` is an integer from 0 through 100.
* `agent_runs.status` is `running`, `completed`, or `failed`.
* `jobs.source` is `search` or `url`.
* `agent_logs.level` is `info`, `success`, `warning`, or `error`.
* Ownership fields cannot be changed after insertion.
* A job run reference and log job reference must belong to the same owner as the row that stores the reference.
* Repeated jobs across discovery runs are allowed. No job deduplication constraint is created.
* Logs are append only for authenticated runtime clients. Referential cascades may remove logs when their run or referenced job is removed.
* Relational deletion does not claim to delete storage objects. The account deletion workflow must remove the stored key before or alongside account deletion.

**Security model**:

The only runtime role is an authenticated account. There are no shared records or application roles in this feature. Policies allow each account to select, insert, update, and delete its own profile, runs, and jobs. Logs can be selected and inserted by their owner, but not updated or deleted by runtime clients. Insert and update policies include ownership checks and composite owner checks for related rows. Broad runtime update privileges are revoked where needed, and owner fields are guarded against change. The anonymous role receives no access to these tables or the private bucket. Resume storage RLS is enabled and has separate owner scoped policies for select, insert, update, and delete. Signed access, when later needed, is issued only after an owner scoped object check and expires after the duration chosen by the profile feature.

The migration grants authenticated users the required select, insert, update, and delete operations on profiles, agent runs, and jobs, then uses RLS and owner guards to limit rows and protected fields. It grants authenticated users select and insert on agent logs and revokes runtime update and delete. It grants authenticated users storage usage and the four storage object operations needed by the owner policies. Anonymous runtime access is not granted.

**Configuration required**:

No new environment variables are required. The existing InsForge project configuration and credentials are used by the CLI and application clients.

**Critical test scenarios**:

* Happy path: apply the SQL migration, create the private bucket, upload `{user_id}/resume.pdf`, insert owned rows, and read them as the same account, verifies **AC-1**, **AC-4**, and **AC-7**
* Failure case: attempt an invalid status, invalid score, negative count, another user's owner id, and a cross user run or job reference, verifies **AC-2** and **AC-3**
* Auth and permission: attempt to read or mutate another user's relational rows or storage object, and attempt to update or delete a log, verifies **AC-3** and **AC-4**

## Build plan

The project uses a facade style foundation plan, with backend contracts established before later data writing features. This feature has no UI slice, so a short migration sequence is the safest slice. Each SQL migration is atomic, while bucket creation remains a separate CLI boundary.

1. Create the versioned SQL migration containing the four public tables, composite owner foreign keys, defaults, nullability, checks, indexes, grants, public table row level security, initial storage object row level security, and ownership protections, satisfies **AC-1**, **AC-2**, **AC-3**, and **AC-5**
2. Create the private `resumes` bucket with the key `{user_id}/resume.pdf`, verify the bucket is private, and verify owner scoped storage policies, satisfies **AC-4**
3. Apply the corrective storage policy migration after bucket creation, removing broad default storage policies while preserving the owner scoped resume policies, satisfies **AC-3** and **AC-4**
4. Apply the migration sequence and bucket configuration to the linked InsForge project as separate steps, then inspect the resulting tables, policies, grants, indexes, and bucket. Treat SQL rollback and bucket verification as separate recovery boundaries, satisfies **AC-4** and **AC-7**
5. Run focused ownership, cross owner reference, invalid value, relational cascade, storage access, and append only log checks, satisfies **AC-2**, **AC-3**, **AC-4**, and **AC-6**

## Consequences

**Positive**:

* Later features share one stable data contract.
* Database rules provide defense in depth for personal data.
* Query patterns for lists and ownership have indexes from the start.
* The backend setup can be reproduced from the repository.

**Negative and tradeoffs**:

* Schema changes require migration discipline and an InsForge CLI connection.
* Private resume access needs authenticated SDK reads or signed URL handling in the profile feature. Signed URLs are bearer links for their expiry period, so the profile feature must perform an owner check before issuing one.
* Append only logs cannot be corrected through normal runtime clients.
* Cascading account deletion removes historical relational job data permanently, while storage cleanup requires an explicit account deletion workflow.

**Neutral**:

* Repeated discovery results may create duplicate looking jobs across runs.
* The schema keeps small structured JSON fields for work experience, education, and company research because the current product reads them as whole values.

## Follow-up

* [ ] Reconcile the build plan wording about tailored job fields with the architecture and product scope before implementing resume tailoring.
* [ ] Build the account deletion workflow that removes `resume_pdf_key` through the authenticated storage API before deleting the auth account, with retry handling for partial storage failure.
* [ ] Define the profile feature's signed URL expiry when resume preview is implemented.

