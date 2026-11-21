# ElektroPlan SM 1 — Connection package release record

## Verified checkpoint
- Development branch: `ElektroPlan-Entwicklung-1`.
- Regression workflow run **#12**: successful, as observed in GitHub Actions on 2026-11-21 for commit `c6bb71436628969355d7cfdb6d674f05622ee4e3`.
- Workflow: `ElektroPlan SM regression checks`.
- The workflow runs JavaScript syntax checks, schematic graph safety checks, Playwright/Chromium setup, and repository regression test files.
- This record does not claim electrical approval, manufacturer API verification, or field commissioning.

## Completed software-safety scope
- Schematic wire-to-terminal adapter preserves unresolved references as pending.
- Terminal graph rejects malformed or ambiguous references and duplicate connections.
- Manufacturer evidence requires manually reviewed provenance; OCR confidence is not terminal authorization.
- Structural validation always reports `electricallyApproved: false`.
- Regression tests are configured to continue across test files and report failures.

## Remaining gates before declaring the whole application released
- Confirm other workflows (quality gate, V132–V133 tests, trial package) against the exact intended release commit and branch.
- Exercise end-to-end Schaltplan drawing, editing, saving/reloading, export, and browser behavior on the intended iPhone/browser.
- Verify backup/rollback and GitHub Pages deployment of the chosen release build.
- Perform qualified electrical review separately; software checks do not replace electrical inspection.

## Branch protection
Do not merge this development branch into `main` or replace camera-test backups without explicit release approval and verified rollback.
