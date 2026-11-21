# ElektroPlan SM 1 — Official 13-point product requirements
Approved by project owner: 2026-11-21. This is the authoritative consolidated specification for future development. It supersedes conflicting illustrative layouts but does not delete previous detailed requirement documents.

## 1. Goal
Professional editable electrical engineering Stromlaufplan editor with AI assistance, verified connectivity and structured project data. Not a picture generator.

## 2. Camera-first recognition
Camera/gallery on iPhone and other devices; single/multiple devices; crop, tap, text/voice selection; AI proposes type, manufacturer, model and article number without mandatory manual fields. Unknowns stay unknown; document evidence and confidence.

## 3. Insert recognized components
Use function-specific IEC/DIN symbols and matching manufacturer terminal documentation; provenance, review state, and user correction. Never infer terminal mapping from visual similarity alone.

## 4. Professional Stromlaufplan engine
Orthogonal conductors, explicit electrical nodes, no accidental crossing junctions, correct symbol geometry, terminal strips, device and wire identifiers, multi-page references, title blocks, automatic layout, editable graph, undo/redo and exports.

## 5. Default conductor rail layout
At TOP: L1, L2, L3, N (N shown blue). At BOTTOM: protective conductor bus **PE** (green/yellow), labeled **PE only**, never 'PA', 'AP' or 'PE (PA)'. PE branches to dedicated PE terminals. N to N terminals; no accidental interchange. This is a default drawing layout, not a claim that every electrical system has the same topology. PA and PEN are distinct concepts and require separate treatment if actually present. Do not use generated demonstration images as electrical truth.

## 6. Correct device symbols
Distinguish MCB/LS 1-4 poles, RCD/FI, RCBO/FI-LS, main switch, contactor, relay, coil and contacts, fuses and terminals; use applicable IEC/DIN symbol definitions and verified component characteristics.

## 7. Existing schematic import and continuation
Capture old paper/photo/scan/PDF; detect wires, symbols, terminal numbers, labels, intersections and pages; convert into reviewable editable graph while preserving source image and layout. Add newly photographed device, propose continuations, show before/after and require review of uncertain or safety-critical edges. Never invent unseen connections.

## 8. AI throughout
AI assists project creation, capture, identification, document lookup, schematic proposals, editing, validation explanations and exports. Deterministic checks and verified documentation govern electrical truth.

## 9. Input methods
Arabic/German/English voice, text, touch; mouse/keyboard on desktop. Functional fallbacks when speech APIs unavailable.

## 10. Languages and platforms
Full German, English, Arabic RTL; iOS Safari, Android, tablets, Windows/macOS/Linux modern browsers. Responsive, accessible, with documented online/offline limitations.

## 11. Persistence and interchange
Save/open/version projects, undo/redo, PDF/SVG/DXF/structured JSON exports. Third-party compatibility only where supported and tested.

## 12. Electrical safety
Typed conductors and terminals, checked net continuity, symbol/function consistency, manufacturer-verified terminal mapping, ambiguity and conflict warnings. N/PE mismatches rejected; PEN/earthing exceptions handled through explicit documented system rules, not guessed. Drafts are not installation approvals.

## 13. Development safety
Protect main, known-good camera test and backups. Develop on ElektroPlan-Entwicklung-1. Run tests and report verified progress; do not describe unimplemented features as ready.

## Supporting detailed specifications
- docs/AI_CAMERA_REQUIREMENTS.md
- docs/MULTILINGUAL_CROSS_PLATFORM_REQUIREMENTS.md
- docs/AI_FIRST_PRODUCT_VISION.md
- docs/AI_SCHEMATIC_IMPORT_EXTENSION.md
- docs/PROFESSIONAL_SCHEMATIC_SYMBOL_REQUIREMENTS.md

## Acceptance gates
A. Camera: single/multi-device selection and crop on iPhone; documented uncertain identification.
B. Verified component: matching device symbol and manufacturer terminal mapping.
C. Schematic: electrically typed editable graph; rails L1/L2/L3/N top, PE-only bottom; correct terminal mapping and no accidental crossing connections.
D. Import: preserve original scan; editable reconstruction; ambiguity flags; user-approved continuation.
E. Multilingual, cross-device save/restore and exports.
F. Automated tests and real-device verification before any production-ready claim.

## Implementation status at approval
Requirements approved; implementation incomplete. Prior electrical-safety.js is a preliminary terminal-label heuristic, not a complete electrical netlist or certified validation. No claim that image/PDF reconstruction, AI identification backend or professional drawing engine are complete.
