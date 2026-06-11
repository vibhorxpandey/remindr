# Veil Content Studio

A self-contained content platform for **Veil AI** (veilresearch.com / [@veilresearch](https://www.instagram.com/veilresearch)) with Instagram-ready, downloadable brand assets.

## What's inside

| | |
|---|---|
| `index.html` | The download hub — filterable galleries, hover video previews, one-click caption copy, and the June 2026 trend report with the million-view reel playbook. |
| `assets/images/` | 25 PNGs: 4 quote cards, 4 stat posts, 4 reel covers, 4 feature-drop cards, a 6-slide carousel ("5 skills AI can't replace"), 3 story templates. Feed posts are 1080×1350 (4:5), covers/stories 1080×1920 (9:16). |
| `assets/videos/` | 8 reels (1080×1920 MP4, 30fps, 9–12s): brand intro, hook reels, listicle, feature drops, stat shock, POV trend, waitlist teaser. |
| `generate_assets.py` | Regenerates every asset from code (Pillow + ffmpeg). Edit copy/colors there and re-run. |

## Run it

```bash
cd content-platform
python3 -m http.server 8000
# open http://localhost:8000
```

(Open `index.html` via a server, not `file://`, so video previews and caption copying work.)

## Regenerate assets

```bash
pip install pillow   # plus ffmpeg on PATH for videos
python3 content-platform/generate_assets.py
```
