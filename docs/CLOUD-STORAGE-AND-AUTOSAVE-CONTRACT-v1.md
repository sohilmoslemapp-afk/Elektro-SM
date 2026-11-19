# ElektroPlan SM — Cloud storage contract v1 (draft)

Status: DESIGN ONLY. No cloud backend is deployed or connected.

## Shared structure
Tenant/company -> members -> projects -> named folders -> assets and revisions.
Modules: Schaltplan, Grundrissplan, media, reports and future modules.
Arbitrary file types may be stored, but previews and parsing require separate support.
Each revision: tenantId, projectId, module, documentId, revisionId, parentRevisionId, timestamp, SHA-256, authorId, byteLength, status.

## Save behavior
Offer Device + Cloud (default), Device only or Cloud only, showing independent success/failure for each destination.
Autosave after meaningful changes and periodically. Power loss before a write completes may still lose the newest change.
States: local_saved, queued, uploading, cloud_committed, conflict, error.
A local pending marker is NOT proof of cloud upload. Only an authenticated durable server commit confirms cloud success.
Offline: durable local queue (prefer IndexedDB for blobs), retry on reconnect. Preserve divergent versions on conflicts.
Media requires upload limits, resumable uploads, checksums, quotas and failure reporting.

## Proposed API — NOT IMPLEMENTED
POST /v1/projects: create under authenticated tenant.
GET /v1/projects/:id/tree: authorized folder and asset listing.
POST /v1/projects/:id/revisions: idempotent versioned commit.
POST /v1/assets/uploads: allocate short-lived signed upload.
POST /v1/assets/:id/commit: verify checksum and attach to revision.
GET /v1/projects/:id/revisions: list restore points.
POST /v1/projects/:id/restore: restore as new revision, never overwrite history.

## Security requirements
Server-enforced tenant isolation and role permissions on every request, private storage by default, TLS, encryption at rest, backup/restore tests, audit logs and retention rules.
Never embed privileged cloud credentials in browser code or public GitHub.
Hosting provider, region, cost, privacy requirements and authentication must be decided before deployment.

## Current implementation
V53 is browser-local schematic autosave plus a pending-sync marker. No cloud persistence, asset upload or cross-device sync is implemented.