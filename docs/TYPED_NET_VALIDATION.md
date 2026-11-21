# Typed electrical net validation — implementation note
Status: preliminary implementation; not an electrical installation approval.

The schematic project JSON format remains version 1. A symbol may optionally declare `terminalTypes`, an object mapping existing `manualTerminals` to `L1`, `L2`, `L3`, `N`, `PE`, `PEN`, `PA`, or `UNKNOWN`. Example:
```json
{"version":1,"symbols":[{"id":"X1","x":100,"y":100,"manualTerminals":["1"],"terminalTypes":{"1":"PE"}},{"id":"X2","x":300,"y":100,"manualTerminals":["1"],"terminalTypes":{"1":"N"}}],"wires":[{"a":"X1","fromTerminal":"1","b":"X2","toTerminal":"1"}]}
```
The check follows connected terminal nets and reports a hard N/PE mismatch; phase-to-PE, phase-to-N, and differing-phase conflicts are also flagged. PEN and PA trigger review. Unspecified types remain unknown and connected unknown nets trigger review. Device terminal labels such as A1, A2, 1, 2 are **not** interpreted as conductor types.

The graphical L1/L2/L3/N top and PE bottom rails are **guides**, not electrical graph edges. Connecting them electrically requires separate explicit typed terminals, verified components, and routing. No hidden or implicit connection is created. Existing saved projects remain loadable.

Limits: device-internal conduction, switches, RCDs, protective devices, earthing system topology, verified manufacturer mappings, and complete standards compliance are NOT yet modeled. These tests are static code checks and must be executed in CI and on real devices. Never mark an imported or edited drawing electrically approved based on these checks alone.

## New editor interaction (2026-11-21)
When adding a component, the editor offers an optional comma-separated conductor-type list aligned to the terminal list. Omitted entries are UNKNOWN, not guessed. Select a component and use the trilingual 'Edit conductor type' toolbar control to change an existing terminal's explicit conductor type; undo restores the prior project state. When adding a new wire, `proposeWire` checks the candidate's complete connected net, rejecting direct and transitive N/PE, phase/PE, phase/N and differing-phase type conflicts before committing the edit. This is conservative: an untyped terminal is not automatically declared safe; review is still needed. Old JSON files without `terminalTypes` remain supported.

The input uses prompts as an interim mobile-compatible UI. Full touchscreen property panels and verified device terminal metadata are pending. Tests were committed; successful CI execution is not yet confirmed.
