# ElektroPlan SM — 3D Grundriss, walkthrough video, real-site video scanning and measurements

## Mandatory scope
1. **Plan-to-3D:** generate a navigable three-dimensional model from an editable Grundrissplan, including walls, room boundaries, doors, windows, corridors, storeys, and eventually electrical fixtures. Support top-down, orbit and first-person views.
2. **Virtual walkthrough video:** allow user to record and replay a guided virtual camera tour of the model, and reopen the project later. Preserve the editable 3D scene and camera path separately from any rendered video.
3. **Real-site capture:** from within a project, capture video or supported depth/LiDAR data of the actual building, associate sessions with that project, and attempt 3D reconstruction only through an implemented and validated photogrammetry/SLAM/depth pipeline. Raw monocular video alone does not provide trustworthy absolute scale.
4. **Point-and-measure:** pause at a wall/corridor/room, select it via touch/mouse, voice or typed command, and request length, width, height, area, or distances. Display measurement origin, units, calibration, accuracy/uncertainty and confidence. Allow user-entered known reference length for calibration and manual correction.
5. **Multilingual multimodal:** German, English and Arabic for UI, status, speech recognition and typed commands; image/video, touch/mouse and speech/text controls. Keep original video and source plan intact.

## Technical separation and accuracy
- Measurements from the **authored plan model** derive from calibrated geometric coordinates; distinguish designed dimensions from as-built dimensions.
- Measurements from **real-world scans** require sensor metadata and verified scale/calibration. Mark uncalibrated scans as not measurable; never invent dimensions or advertise construction-grade accuracy without validation.
- iPhone/Android capabilities differ. Use feature detection and offer photo/manual input fallback. Browser camera video is not equivalent to LiDAR scanning.
- Use privacy controls for recordings (people, faces, property), explicit recording permission, local-first storage when feasible, and user-managed deletion.
- Do not represent visualization as structural, architectural, electrical or building-code certification.

## Milestones
1. Basic 2D Grundriss editor with calibrated wall geometry and doors/windows.
2. Generate simple 3D extruded walls and interactive orbit camera; measurement from plan geometry.
3. Add virtual walkthrough and video recording/export, with browser capability checks.
4. Add real-world camera video capture tied to a project; keep as video until a reconstruction engine is implemented.
5. Integrate device-specific depth/LiDAR or validated reconstruction, scale calibration and measured-object picking.
6. Full multilingual voice/text commands and regression testing on iOS, Android and desktop.

**Status:** Requirements recorded. 3D reconstruction, scanning and reliable real-world measurement are not implemented yet.
