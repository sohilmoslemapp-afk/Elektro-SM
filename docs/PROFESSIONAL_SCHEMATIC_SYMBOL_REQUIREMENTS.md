# ElektroPlan SM 1 — Professional Stromlaufplan and correct electrical symbols
Date: 2026-11-21. Approved priority; requirements documentation only. No production code change.

## Highest priority
The finished product must be a professional, component-library-independent Stromlaufplan editor, not merely an image composer or collection of electrical icons. Geometry, connection graph, page layout, cross-references, numbering, validation, export, undo/redo and multi-page editing must be developed and tested independently of the size of the component catalog.

## Component-specific schematic symbols
Each device must have the appropriate electrical schematic representation according to its actual electrical function and applicable IEC 60617 / DIN EN 60617 symbol conventions and verified manufacturer data. Never reuse a generic 3-pole breaker symbol as the FI/RCD symbol merely because both have three phase conductors.

Represent distinctions for:
- 1-, 2-, 3-, 4-pole LS/MCB devices and mechanically coupled poles
- FI/RCD residual-current protection and its appropriate 2- or 4-pole arrangement, including N where applicable
- Main switches, disconnectors, fuses, RCBOs, relays, contactors and auxiliary contacts
- Coil terminals, main/auxiliary contacts, terminal identifiers and device cross-references

## Data model
Keep distinct: device identity; electrical function; symbol definition; number of poles; terminal list; mechanical coupling; contact type; wiring graph; layout coordinates; manufacturer evidence; review status.
A symbol must be chosen from function and device characteristics, not from pole count or AI visual similarity alone.

## Quality gates
Use documented symbol sources and appropriate rights/licensing. Validate the symbol type, terminal mapping, conductor continuity and cross-references; show uncertainty and request review rather than invent connections. Test schematic renderings across devices and page sizes. A visually plausible AI illustration is not an electrically verified drawing.

## Existing illustrative image
The earlier generated schematic picture was illustrative and contained oversimplified FI/RCD representation; do not use it as a canonical wiring reference.

## Scope
Preserve original main and backup. This document records priorities, not completed implementation.
