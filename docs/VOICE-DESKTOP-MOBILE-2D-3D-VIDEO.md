# Mandatory: Voice, desktop, mobile and tablet workflows for video → 2D/3D Grundriss

## User requirement
The entire Grundriss workflow—recording/importing project video, requesting 2D floor plan, requesting 3D floor plan, and editing architecture/electrical placements—must work by **voice commands**, typed commands, and manual mouse/touch/keyboard controls. Must support office **desktop/laptop** and **iPhone/Android/tablet**, with the same project model.

## Examples
- AR: «افتح المشروع رقم عشرة، حلّل الفيديو، اعمل Grundriss عادي وثلاثي الأبعاد»
- DE: „Öffne Projekt 10, analysiere das Video und erstelle einen 2D-Grundriss und ein 3D-Modell.“
- EN: “Open project 10, analyze the video, and generate both a 2D floor plan and a 3D model.”
- AR: «حط باب على هالحائط، وزّع ثمانية سبوتات بالسقف»

## UX acceptance criteria
- Desktop: responsive wide-screen layout; mouse precision, keyboard shortcuts, video import from files/webcam, large 2D and 3D editing workspaces.
- Mobile/tablet: touch targets, camera capture, voice/text controls, project preview, ability to edit and save.
- Voice: explicit mic permission; browser speech recognition when supported, text fallback; spoken command preview/confirmation for consequential modifications; locale AR/DE/EN.
- Shared project identifiers and structured 2D/3D data, linked video evidence, edit history, undo, versions.
- Cross-device continuation requires authenticated backend/cloud sync and conflict resolution; **not implemented by local browser IndexedDB**.
- One-command video reconstruction is a future pipeline requiring calibrated reconstruction; no claims of automatic measured plans before validation.

## Status
Requirement recorded. Current prototypes provide limited voice command parsing, responsive browser UI and manual 2D/3D editing. They do not yet provide full voice control, true video reconstruction or cross-device synchronization.
