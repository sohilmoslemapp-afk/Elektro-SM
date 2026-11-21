# ElektroPlan SM 1 — AI-first platform-wide architecture (approved requirement)
Date: 2026-11-21. Applies to branch ElektroPlan-Entwicklung-1, preserves main and backups.

## Product goal
Build a globally competitive electrical-engineering platform focused on usability, speed, reliability, and safety. This is a product objective, not an unverified claim of superiority.

## AI integrated throughout the workflow
- Project setup: understand natural-language goals and propose structured project configurations.
- Capture: camera, gallery, crop, multi-object selection by touch, text or speech.
- Identification: multimodal recognition; automatically populate component type, and manufacturer/model/article number when supported by evidence; no mandatory manual model/article entry.
- Knowledge: retrieve matching manufacturer documents; expose sources, version and confidence; never invent terminal mappings.
- Schematics: propose symbols, place components, draft connections and organize layouts with explicit provenance and review status.
- Editing: Arabic/German/English voice, text, touch, mouse/keyboard; contextual commands and Undo/Redo.
- Validation: run deterministic electrical/schema consistency checks alongside AI suggestions; safety-critical changes require verification and user approval.
- Output: explain, document, save and export projects; favor interoperable formats and documented integrations.

## Cross-cutting requirements
- German, English, Arabic including RTL; iOS, Android, tablets, Windows/macOS/Linux via modern browsers.
- AI service availability and costs must be explicit; graceful fallback for offline/unsupported features.
- Security: authenticated backend for model calls, never expose API keys in browser code; privacy and data minimization for site photos.
- Accessibility and touch-first responsive design.
- Track accuracy, latency, failure rates, schematic correctness and user acceptance with repeatable tests.

## Implementation principle
AI assists and accelerates all phases but is not the source of electrical truth. Verified manufacturer documentation and deterministic checks govern electrical terminal assignments. Distinguish proposals from approved drawings. No unsupported promise of 100% identification or universal third-party software compatibility.

This document records approved requirements, not completed functionality.
