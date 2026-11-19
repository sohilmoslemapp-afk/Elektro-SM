# ElektroPlan SM cloud service — implementation starter

> Not deployed. No cloud storage is active. Never place service credentials in the browser prototype.

## PostgreSQL schema (tenant-scoped)
```sql
CREATE TABLE tenants (id uuid PRIMARY KEY, name text NOT NULL);
CREATE TABLE members (tenant_id uuid NOT NULL REFERENCES tenants(id), user_id uuid NOT NULL, role text NOT NULL CHECK (role IN ('owner','admin','editor','viewer')), PRIMARY KEY(tenant_id,user_id));
CREATE TABLE projects (id uuid PRIMARY KEY, tenant_id uuid NOT NULL REFERENCES tenants(id), name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,tenant_id));
CREATE TABLE folders (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, project_id uuid NOT NULL, parent_id uuid, name text NOT NULL, FOREIGN KEY(project_id,tenant_id) REFERENCES projects(id,tenant_id), UNIQUE(id,tenant_id,project_id), FOREIGN KEY(parent_id,tenant_id,project_id) REFERENCES folders(id,tenant_id,project_id));
CREATE TABLE documents (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, project_id uuid NOT NULL, folder_id uuid, module text NOT NULL, name text NOT NULL, current_revision_id uuid, FOREIGN KEY(project_id,tenant_id) REFERENCES projects(id,tenant_id), FOREIGN KEY(folder_id,tenant_id,project_id) REFERENCES folders(id,tenant_id,project_id), UNIQUE(id,tenant_id));
CREATE TABLE revisions (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, document_id uuid NOT NULL, parent_revision_id uuid, author_id uuid NOT NULL, object_key text NOT NULL, sha256 text NOT NULL, bytes bigint NOT NULL CHECK(bytes>=0), created_at timestamptz NOT NULL DEFAULT now(), FOREIGN KEY(document_id,tenant_id) REFERENCES documents(id,tenant_id), UNIQUE(id,tenant_id,document_id));
CREATE TABLE sync_requests (tenant_id uuid NOT NULL, document_id uuid NOT NULL, idempotency_key text NOT NULL, revision_id uuid NOT NULL, PRIMARY KEY(tenant_id,document_id,idempotency_key));
```

## API contract and commit sequence
1. Authenticate user server-side; resolve tenant membership and permission for requested project/document on EVERY request.
2. POST /v1/assets/uploads: allocate a short-lived upload for a tenant-scoped private object key; enforce size/type policy and quotas.
3. Client uploads bytes directly to private object storage using the short-lived upload URL.
4. POST /v1/documents/{id}/revisions with parentRevisionId, sha256, bytes, objectKey, idempotencyKey.
5. Server verifies uploaded object digest/length and membership, then commits revision and current pointer atomically if parent revision matches.
6. If parent differs, return 409 Conflict and retain both candidate revisions for explicit resolution.
7. Return revisionId, committedAt and checksum. Only then may UI display Cloud saved.
8. GET /v1/documents/{id}/revisions and POST /v1/documents/{id}/restore create new immutable restore revision.

## Offline and cross-device
Use IndexedDB for durable local queue of metadata and blobs, with storage quota checks. Retry with idempotency keys after reconnection or next app launch. A pending marker alone is not a queue. Never discard local data before verified cloud acknowledgement. Sync can require user to reopen the app; browsers do not guarantee background execution.

## Security and deployment blockers
Choose cloud provider, EU region, identity provider, budget and retention policy. Configure encrypted private object storage, TLS, per-tenant authorization, backups, monitoring, malware scanning and restore drills. Enforce database row-level access or server authorization, not just tenant IDs in request bodies. The SQL schema is a starting point, NOT a production-ready migration: further FK/index/RLS checks and tests are required.

## Status
This is a backend implementation blueprint, not a running server. The Schaltplan prototype V56 only saves locally.