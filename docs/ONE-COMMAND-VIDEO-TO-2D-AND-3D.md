# Priority requirement: one command converts full project video into both 2D Grundriss and 3D model

**User command example (Arabic):** «حلّل هالفيديو وجهز لي Grundrissplan عادي 2D وكمان Grundrissplan ثلاثي الأبعاد 3D». German and English equivalents and speech/text support mandatory.

## Expected product behavior
1. Take **the complete project video**, not just one manually extracted frame. Analyze spatial continuity and coverage; identify rooms, corridors, walls, doors, windows, connections, levels, and occluded/unknown areas.
2. Produce **editable 2D Grundrissplan** with dimension annotations only when supported by calibrated scale, verified depth sensing, or manual reference measurements. Otherwise show unscaled/estimated geometry with uncertainty and require review.
3. Produce a **navigable 3D model** of the same project, sharing wall/room/opening identifiers and calibrated coordinates with 2D; 2D edits propagate to 3D.
4. Link source video, time-coded evidence, 2D plan, 3D scene, calibration, uncertainty and versions to the same project identifier; preserve originals.
5. Offer a guided verification step before using for installation planning. Highlight unobserved surfaces and unknown geometry. Interior footage does not establish exterior roof or facade; require exterior capture or mark conceptual.
6. One action should orchestrate the workflow; any missing sensor/scale/capture inputs are clearly requested, not invented.

## Engineering phases
A. Current: video capture, local project archive and paused-frame PNG extraction prototypes.
B. Next: synchronized project data model; manual traced 2D and simple derived 3D with calibrated dimensions.
C. Later: multi-frame reconstruction (SLAM/SfM/depth), geometry segmentation, scale validation and user review.
D. Final: one-command orchestrator that runs verified reconstruction and outputs both linked 2D/3D artifacts.

**Status:** critical requirement documented, not yet automatically implemented. Do not claim that existing video capture generates measured 2D/3D.
