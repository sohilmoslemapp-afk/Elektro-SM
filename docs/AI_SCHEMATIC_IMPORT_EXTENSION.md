# ElektroPlan SM 1 — AI schematic image/PDF import and extension
Approved user requirement, 2026-11-21. Development branch only; preserve main and backups.

## Scenario
User supplies a photo, scan or PDF of an existing electrical schematic and a photo/identified component. Via Arabic, German or English text or speech, or by touching a location, asks: “Add this component at this position and continue its connections as shown in the plan.”

## Required workflow
1. Import an existing schematic from camera, gallery, image or PDF. Support editable schematic formats through documented importers when available.
2. AI analyzes the plan: detect symbols, references, wires, terminals, labels and page structure. Keep the source image and show uncertain or unreadable details; no fabricated connections.
3. Convert detected elements into an editable, reviewable graph, preserving source-to-graph traceability and the original layout.
4. Identify the new component from its photo; auto-fill component type and available manufacturer/model/article information without mandatory manual fields. Obtain matching verified manufacturer terminal data before claiming wiring accuracy.
5. Let the user select insertion position by tap/drag or natural-language command (“right of K1”, “on page 2 next to F3”).
6. Propose the symbol and continuation of wiring according to the reviewed original schematic and validated component documentation. Show a before/after preview, mark tentative edges and request explicit approval for electrical changes.
7. Support multilingual Arabic/English/German voice, text and touch corrections, undo/redo, save a new version, export. Preserve the unmodified source plan.
8. Test multi-page plans, low-resolution images, ambiguous intersections, overlapping labels, inconsistent terminal numbers, and conflicts. Never silently guess a physical connection.

## Safety / product status
A raster image alone does not establish a verified electrical netlist. AI suggestions are drafts until graph interpretation and terminal mapping are checked. This is an approved feature requirement, not a claim that it has been implemented.
