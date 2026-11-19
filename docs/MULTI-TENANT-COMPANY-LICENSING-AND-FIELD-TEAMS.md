# ElektroPlan SM — Company subscriptions, seats and field teams

Status: product requirements and security architecture; NOT yet implemented.

## Ownership and sales
- Platform owner has a separate super-admin account to create, suspend and manage independent company tenants.
- Each company buys a subscription with a configurable number of named user seats (example: Al Raqi company, 20 seats).
- Owner may grant a 7-, 14-, or 30-day free trial, with explicit start/end timestamps and an entitlement status. Trial expiry blocks paid features until activation; do not silently charge.
- Paid plans, invoices, billing, renewal, tax, cancellations, payment providers and pricing must be designed and legally reviewed before launch. No payment processing is implemented.

## Company administration
- Each company has its own administrator(s), who can invite, deactivate and replace employees within the licensed seat limit.
- Seat accounting is server-side, transactional, and auditable. Invitations may reserve seats with expiry. A user cannot bypass the seat limit by editing client-side storage.
- Each employee has an individual login. No shared company password.
- Suggested roles: company admin, project manager, office designer, field technician, viewer. Permissions must be explicit and enforced by server APIs, not only hidden buttons.
- Company admin assigns staff to projects; field staff can view approved plans, upload site videos/photos, add measurements, observations and change proposals; office staff can review and accept changes. Important edits require approval and audit history.

## Multi-tenant security
- Every tenant-owned database row and storage object must be scoped by immutable tenant ID, and project IDs cannot authorize access across tenants.
- Enforce tenant isolation in database row-level policies or equivalent service authorization; validate access on every API and file download.
- Separate platform super-admin privileges from company admin. Record impersonation/support access with explicit authorization and audit logs.
- Use secure authentication, MFA for administrators, revocation, invitation expiry, encryption in transit and at rest, backups, deletion/export policies and GDPR-compliant data processing.
- Prevent cross-company leaks in searches, media URLs, exports, AI prompts, background jobs and cache keys.

## Field and office collaboration
- Same project shared across iPhone, Android, tablets and office desktop through authenticated cloud synchronization; local offline edits queue and reconcile on reconnect.
- Every plan/video/photo is linked to company, project, author, timestamp and revision; conflicts require review rather than silent overwrite.
- Field worker can capture a video, inspect a 2D/3D plan, attach observations and propose modifications. Office designer can approve and publish a new version.
- Retain original uploaded media and revision history. Never present estimated video geometry as measured truth; require calibration and uncertainty markers.

## Licensing model
- Tenant: company_id, company_name, status.
- Subscription: company_id, plan, seat_limit, trial_start, trial_end, period_start, period_end, status.
- Membership: user_id, company_id, role, status, invited_by, joined_at.
- Project: company_id, project_id, members, revisions, media.
- Audit event: actor, company_id, project_id, action, timestamp, before/after references.

## Implementation gates
1. Secure identity, tenant isolation and server authorization.
2. Owner console: tenant and trial controls.
3. Company console: staff invitations, roles and seat enforcement.
4. Project permissions, cloud media and revision sync.
5. Billing integration and trial-to-paid transition.
6. Security tests: cross-tenant access, seat races, expired subscriptions, revoked users, offline conflict, file URL leakage.

Existing GitHub prototypes currently use browser-local storage and have NO secure multi-company account system, seat enforcement, payment, or cloud collaboration. Do not sell or describe them as ready for customer deployment.
