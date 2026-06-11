# DioneyMaker — Performance Thresholds

- Target FPS: 60
- Minimum acceptable FPS: 30 (on mobile low-end)
- draw_call_budget: 60 per frame
- worst_case_scene: crew scene (5 character sprites + background + HUD bar + dialogue box + scanline overlay)
- Max JS bundle: 200 KB uncompressed
- Max asset per image: 256 KB
- Audio: ambient loop ≤ 500 KB, SFX ≤ 100 KB each
- Save/load: localStorage, instant (< 50ms)
- Input latency: ≤ 100ms from tap/click to visual response
