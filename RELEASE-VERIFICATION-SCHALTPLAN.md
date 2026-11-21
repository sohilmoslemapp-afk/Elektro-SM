# ElektroPlan SM 1 — release verification (development branch)

## Evidence verified 2026-11-21
GitHub Actions workflow **Schaltplan integration tests #34**, commit `b62312d`, branch `ElektroPlan-Entwicklung-1`, was shown as **Success** in the GitHub Actions jobs screenshot. The screenshot showed all four jobs green:
- `browser-smoke (webkit)`: 1m 19s
- `browser-smoke (chromium)`: 33s
- `browser-smoke (firefox)`: 36s
- `schematic-tests`: 6s

This validates the tests included in that run, **not** every feature of the entire application. Browser engines tested by Playwright are not a substitute for physical-device field acceptance.

## Functionality covered by automated tests
- Schematic editor loads on desktop, phone and tablet profiles; Arabic/English/German UI.
- Component insertion, validation, keyboard movement, pointer/touch input, undo.
- JSON import/export, round-trip, invalid/oversized input rejection.
- SVG and DXF exports; terminal connection, deletion and undo.

## Safety and release gates
- Schematic terminal validation is graphical/data validation, **not electrical safety approval**.
- Manufacturer-specific wiring and electrical compliance must be verified against manufacturer documents and applicable rules.
- Do not merge to `main` without explicit authorization.
- Keep original `main` and all backup versions untouched.
- Prior to calling the **whole application** 100% complete, review the camera/OCR workflow, manufacturer/model library, document lookup, integration into the main UI, real iPhone/Safari usage, and full regression scope against the user's acceptance criteria.
- After further changes, re-run CI and capture the new commit-specific results; #34 only certifies commit `b62312d`.
