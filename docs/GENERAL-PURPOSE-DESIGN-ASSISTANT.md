# ElektroPlan SM — General-purpose design assistant (mandatory)

The user explicitly rejects a fixed lights-and-sockets-only application. All features must work across **Grundrissplan and Schaltplan**, and support open-ended requests via **Arabic, German and English**, through **speech, typed text, touch/mouse and relevant photo/video input**.

## Scope and examples
- Electrical installation: switches/pushbuttons (Taster), sockets, ceiling lights, spotlights, LED strips, emergency lights, motion/presence sensors, smoke/fire alarms, KNX devices, distribution panels, circuits, cables, data/network points, cameras, access control, etc.
- Architectural Grundriss: walls, doors, windows, room resizing, corridors, dimensions, floors, room and wall selection.
- Schaltplan: wiring and terminals, components, electrical symbols, cross-references, manufacturer-specific verification.
- 3D: generate navigable 3D model from authored plan; video walkthrough, project-associated real-world video, later validated 3D scanning and calibrated measurements.
- Examples: 'وزع سبوتات بالسقف على صفين', 'ضع شريط LED حول الغرفة', 'حط طقات عند الأبواب', 'Steckdosen an dieser Wand verteilen', 'Place detectors in the corridor', 'Show this floor plan in 3D'.

## Architecture
1. **Intent parser** converts speech transcription or text to structured action: verb, element category, target (room/wall/circuit), quantity, geometry, constraints, and confidence. Keep original text and locale.
2. **Semantic element catalog** is extensible: element type, symbol, floor-plan footprint, optional 3D geometry, mounting location, manufacturer metadata, Schaltplan terminals, allowed parameters, safety notes.
3. **Spatial/context engine** resolves references to selected room/wall, handles placement and geometry, preserves wall anchors, and detects clashes.
4. **Plan action engine** provides preview, user edit, explicit accept/reject, undo/redo, and audit trail. No silent destructive actions.
5. **Validation layer** distinguishes conceptual placement from verified engineering. Apply relevant DIN/VDE and manufacturer requirements only when reliably sourced and implemented; avoid claiming automatic compliance.
6. **Capability fallback**: when intent or catalog item is unsupported, explain exactly what is missing and offer manual placement or clarification. Never falsely say an arbitrary request was completed.

## Delivery strategy
- V2 Grundriss has only basic rectangular ceiling light distribution and sockets on selected wall; no broad natural-language reasoning.
- Next: extensible element catalog and generic spatial placement for spotlights, LED strips, pushbuttons and sensors, plus unified trilingual command mapping and preview.
- Later: intelligent constraint-aware layouts, Schaltplan integration, manufacturer verified wiring, photogrammetry/LiDAR and true 3D rendering.

Status: requirement recorded, not all capabilities implemented.
