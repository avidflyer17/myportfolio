# Fix AI Chat Glitch

## Status
- [x] Identify the glitch source (CRT Noise & Scanlines causing edge flickering).
- [x] Remove `CRTScanLines` component and associated animations.
- [x] Verify compilation/linting.

## Notes
The user reported an "unpleasant glitch" on the AI conversation window. Modification involved removing the CRT scanline and noise effects, which were shifting the background layer and creating visible gaps at the window edges.
