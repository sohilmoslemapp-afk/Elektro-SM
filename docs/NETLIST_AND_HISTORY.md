# Explicit netlist export — ElektroPlan SM 1

The schematic editor now provides **Netzliste exportieren / Export netlist / تصدير قائمة الشبكات**. The downloaded `elektroplan-netlist.json` contains deterministic NET001... groups, each listing explicit device ID and terminal ID pairs.

Only `project.wires` edges create connectivity. Crossing lines, visually adjacent terminal markers, the L1/L2/L3/N and PE rail guides, and device-internal contacts are **not** automatically electrically joined. Disconnected terminals are represented as single-terminal nets. This prevents accidental inference of a junction from drawing geometry.

This export is a structural interchange preview, **not** an IEC-validated or manufacturer-approved electrical netlist. The editor preserves the project JSON as the primary editable source. Tests cover reversed-edge order, invalid wire references and unconnected terminals. CI results must be checked independently.

## Editor history

Undo/redo uses bounded project snapshots; new edits clear the redo branch. Keyboard shortcuts: Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl/Cmd+Y. The editor also has dedicated undo and redo controls.
