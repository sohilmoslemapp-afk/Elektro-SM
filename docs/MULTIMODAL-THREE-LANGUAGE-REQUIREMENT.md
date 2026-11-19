# ElektroPlan SM — three languages × four interaction methods

**Mandatory for all past, present, and future features.** Supported interface and command languages: German (de-DE), English (en-US), Arabic (ar-SA). Supported interaction modalities: (1) spoken commands, (2) photo/image input, (3) touch or mouse, and (4) typed commands.

## Acceptance criteria
- Every applicable user action (select, move, delete, reconnect, annotate, inspect, import, export, print, undo, title block, component identification) must be reachable by touch/mouse and typed/spoken command in each of the three languages.
- Image capture/upload is a shared input modality, not a spoken language: a photo may be followed by commands in any selected language. If image recognition is not implemented, show that limitation clearly; never pretend an image has been understood.
- Keep a visible language switcher and microphone button, camera/photo import, editable text command field, and accessible touch/mouse controls where applicable.
- Recognized speech is transcribed and then passed to the same command execution layer as typed text; confirmation, undo, and preview are consistent across modalities.
- Arabic RTL layout must not mirror wiring diagram geometry, technical symbols, pin numbers or image coordinates.
- Safety-critical or destructive operations require preview and confirmation independent of input method. Manufacturer-specific wiring remains unverified unless backed by official evidence.
- Handle browser permission denial, speech unavailable, poor recognition, camera unavailable, and unsupported commands in all three languages; offer another input method.
- Store language preference separately from project content; switching language never changes or translates user-entered plan data without permission.
- Cross-platform QA: iPhone Safari, Android Chrome, desktop; speech recognition may vary by browser, and no capability should be claimed tested before device verification.

## Current status
**Requirement recorded, not fully implemented.** Existing prototypes contain partial language and modality support; do not label the project as fully multilingual/multimodal until coverage and real-device testing pass.
