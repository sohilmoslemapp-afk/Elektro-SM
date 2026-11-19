# ElektroPlan SM — Two full plan types

Mandatory product scope: **Schaltplan / Stromlaufplan** and **Grundrissplan / Elektroinstallationsplan**. Every relevant workflow (new plan, image/PDF/DXF import, editing, commands, review, title block, save, export, printing) must support both plan types, using German, English and Arabic, and voice, typed commands, photo input, and touch/mouse. Existing prototypes do not yet meet full scope.

## Grundriss editor
- Create floor plan from scratch; import old plans as reference and eventually reconstruct editable geometry from images/PDF/DXF with review.
- Add/move/delete walls; edit room dimensions and geometry; insert/move/remove doors and windows, wall openings; manage room names, floors, measurements and scale.
- Add/move/remove electrical installations (sockets, lights, switches, sensors, alarms, cable routes), and annotate them on the floor plan.
- Geometry rules: walls are segments with stable IDs; doors/windows are anchored to wall IDs and offsets. Warn when a wall move makes an opening invalid; never silently discard an opening. Room area is only reliable for closed boundaries and calibrated dimensions.
- Use undo/redo, selection preview and confirmation for destructive operations. Keep original plan and imported source unmodified.
- Print on user-defined paper sizes and calibrated scale. Company title block supports manual data or cropped image from previous plan.
- Safety: this is a draft/planning tool, not architectural permit, structural engineering certification, electrical sign-off or fire-safety approval.

## Schaltplan editor
- Preserve manufacturer-specific terminal verification, connected-wire movement modes, schematic symbols and annotations, unverified status, and export requirements.

## Roadmap
1. Introduce plan-type switch and common project data model.
2. Implement editable walls with endpoints and basic door/window anchoring.
3. Implement calibrated dimensions and room polygons, electrical overlay, undo/redo.
4. Add DE/EN/AR voice/text command grammars, camera/photo reference and guided tracing.
5. Add DXF/PDF import/export and automated recognition only when actually implemented and tested.

Status: scope recorded, Grundriss geometry implementation underway; existing features are partial prototypes.
