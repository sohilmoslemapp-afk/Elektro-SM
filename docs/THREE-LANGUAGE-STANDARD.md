# ElektroPlan SM — mandatory three-language standard

Applies retroactively to **all** project features and prototypes, including camera capture, component recognition, manufacturer verification, schematic drawing/editing, legacy-plan filtering, title blocks, licensing, printing, import/export, errors, confirmation dialogs, help, and speech/text commands.

Languages: **Deutsch (de)**, **English (en)**, **العربية (ar)**. No feature is considered localization-complete until all three are available. Existing prototypes with only one or two languages are **not yet compliant**.

## Implementation contract
- All user-visible strings must use translation keys in a central dictionary; no hard-coded UI text in feature code.
- Language switcher must be visible and usable during editing. Persist preference locally without modifying open documents. Default language is German until user selects another.
- Set document lang and direction (RTL for Arabic, LTR for German/English); keep electrical drawing canvas/SVG coordinates and wire directions unchanged by RTL.
- Translate labels, dialogs, help, status, error/safety messages, accessibility labels, PDF/export UI and onboarding. Preserve manufacturer model numbers, pin identifiers and technical standards verbatim.
- Text-command parsing and speech recognition must cover de-DE, en-US and ar-SA; unsupported browser speech must show translated fallback. Do not claim general AI understanding when only rule-based commands are implemented.
- User content (company name, schematic labels, original annotations) must not be silently translated. Provide optional explicit translation with review when implemented.
- Test iOS Safari, Android Chrome and desktop; test RTL layouts, text wrapping, fonts, PDF and print output. Maintain source images and project content when switching language.
- Electrical instructions require verified manufacturer-specific evidence and explicit uncertainty; localization must not change electrical meaning.

## Migration checklist
1. Inventory every prototype and all user-visible strings.
2. Create shared localization module and dictionaries for de/en/ar.
3. Migrate legacy-plan editor, integrated schematic editor, camera and company title-block tools.
4. Add translated command grammars and speech locale selector.
5. Add regression checks for missing translation keys, RTL and print/PDF.

Status: **Policy and implementation requirement recorded; existing prototypes still need migration.**
