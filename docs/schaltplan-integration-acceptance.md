# Schaltplan Integration & Final Testing — acceptance contract

Branch: `ElektroPlan-Entwicklung-1`. Baseline: `125e6fa51eb59b228f8fd5f11415f0d10ddb5866`.

## Non-negotiable acceptance criteria
1. **Deutsch / English / العربية**: all visible editor controls, warnings, validation results and export labels have translations; Arabic layout supports RTL without reversing electrical symbols.
2. **Mouse, touch/finger, keyboard**: create/select/move symbols, draw/undo wires, zoom/pan, keyboard shortcuts; pointer and touch work without double firing.
3. **Voice**: opt-in, browser-capability-gated commands; explicit confirmation for destructive actions; keyboard/touch equivalents always available; unsupported browsers show honest fallback.
4. **Drawing safety**: user-defined terminal identities only; no inferred electrical approval; ambiguous, missing, duplicate and malformed references block acceptance; save/reload preserves all pending wires.
5. **Interoperability**: native project JSON round-trip; DXF import/export with documented supported subset and unsupported-entity warnings; PDF export and import as view/reference where supported, never claim PDF automatically becomes an editable electrical schematic. SVG and image export tested. Document limits of DWG and proprietary formats.
6. **End-to-end tests**: build/edit/save/reload/validate/export/import flows; iPhone Safari touch, desktop mouse/keyboard, locale switching, error recovery, file safety and offline behavior where claimed.
7. **Release gates**: all regression, quality, V132–V133, trial-package and browser smoke checks pass for one pinned commit; manual acceptance evidence recorded; rollback tested.
8. **Protection**: do not overwrite `main`, camera-test backups or deploy a release without explicit approval.

## Current status
- Prior connection-package regression workflow #12 was green at `c6bb7143` (reported by user screenshot).
- This integration package is **OPEN**. The criteria above are targets, not implemented or verified features.
- Completion requires actual code integration, passing automated checks and device acceptance; this document alone is not a release.
