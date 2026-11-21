# ElektroPlan SM 1 — iPhone release acceptance

Candidate: ElektroPlan-SM-Preview. This is a test checklist, not proof of field acceptance.

## Before testing
1. Publish the exact preview commit on a **separate HTTPS host**. Do not redirect or overwrite the existing GitHub Pages site, which serves Kamera-Test 4.
2. Record deployed commit SHA and confirm the site is serving the new index.html and schaltplan.html, with src/*.js loading without 404 errors.
3. Test on iPhone Safari using the HTTPS address, not a local file URL. Grant camera access only when Safari asks.

## Actual iPhone checks (all must be performed)
- Camera: Kamera öffnen opens rear camera, captures image, shows preview, handles permission denial gracefully.
- Gallery: Bild auswählen imports an existing image; no previous image remains accidentally selected.
- Recognition: image-text recognition reports its experimental nature; no manufacturer or article number is fabricated.
- Manual recognition: enter manufacturer/model/article number separately, verify matching component and evidence source; unknown model is handled honestly.
- Integration: insert selected component into Schaltplan, verify expected labels and terminals.
- Editor: place/move/delete component with touch, connect terminals, undo, validate disconnected or invalid connections.
- Files: export/import JSON round-trip, invalid JSON rejection, SVG and DXF export on Safari.
- Languages: switch DE, AR and EN; verify RTL layout and readable controls.
- Persistence: reload, confirm only promised state survives; exported files can be reopened.
- Security: no misleading claim that schematic graph validation is electrical safety approval; wiring must be checked against original manufacturer documentation and applicable standards.

## Release decision
Mark RELEASE ACCEPTED only after CI for the **exact deployed commit** passes, all device checks are recorded as passed, and independent HTTPS deployment is verified. Otherwise label RELEASE CANDIDATE / NOT FIELD-ACCEPTED.

## Protection
Keep main, old GitHub Pages, and original camera-test backup unchanged. Never publish a private repository's source to a public host without confirming publication is intended.
