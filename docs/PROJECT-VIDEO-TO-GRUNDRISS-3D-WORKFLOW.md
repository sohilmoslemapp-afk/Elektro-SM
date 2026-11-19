# ElektroPlan SM — Project video to measured Grundriss and interior/exterior 3D

## User workflow
1. Open/create project by identifier, e.g. project 10.
2. Open in-app camera and record a walk-through of actual premises; attach footage and available sensor/depth metadata to project 10.
3. User commands in Arabic/German/English: 'اعمل لهذا الفيديو مشروع رقم 10', 'سوي Grundrissplan بالقياسات', 'أعطيني ثلاث الأبعاد من الداخل والخارج'. Voice, typed, touch and video/photo modalities supported.
4. Extract tentative rooms, walls, openings, levels, and connections from captured evidence, then present editable Grundriss draft with provenance and uncertainty per measurement.
5. Require real scale source: calibrated depth/LiDAR with known accuracy, known-length reference, manual dimensions, or survey measurements. Monocular video alone cannot guarantee absolute dimensions; do not invent measurements.
6. Generate interactive 3D interior from verified plan. Generate exterior only from exterior capture, architectural elevations, measured footprint/heights, or explicit user assumptions; mark unknown façade/roof details as unknown or conceptual.
7. Enable pause/select wall or room and ask for dimensions; show provenance, units, uncertainty, and designed vs as-built status.
8. Allow edits and electrical fixture placement on resulting Grundriss; synchronize validated model with 3D and, where applicable, Schaltplan.
9. Save project video, draft plan, measurements, 3D scene and versions independently; support privacy controls, recording permissions, consent, retention/deletion and offline fallback.

## Phased implementation and honest status
- Phase A: in-app camera recording attached to project ID, video replay and manual Grundriss tracing/calibration.
- Phase B: camera/depth sensor integrations, geometric reconstruction, measured-room review and uncertainty.
- Phase C: navigable interior/exterior 3D, walkthrough video and contextual measurement/fixture commands.
- Phase D: validated import/export and multi-floor/building workflows.

No automatic measured 3D reconstruction is implemented yet. Do not claim that generic browser video provides construction-grade measurements or an accurate exterior.
