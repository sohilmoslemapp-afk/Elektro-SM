# Schematic symbol library — preliminary
The editor now accepts optional `symbolKind` values `mcb`, `rcd`, `switch`, `fuse`, `relay-coil`, `contact-no`, `contact-nc`, `terminal`. Different vector primitives are rendered and can be selected during Add Component.

**Important:** These are early visual symbol primitives, not a complete IEC 60617 licensed symbol catalog or manufacturer-approved schematics. They do not establish pole count, internal connections, RCD function, mechanically coupled contacts, terminal locations or electrical validity. The current rectangular device bounding boxes and generic terminal dots remain; this is an incremental preview only.

Next milestones: device-specific terminal geometry and pole arrangements, metadata-driven verified symbol definitions, orthogonal graph routing and junction semantics, manufacturer evidence, import of photo/PDF into editable graph, and end-to-end tests on iOS/Android/desktop.

All changes confined to development branch; main and backup untouched.
