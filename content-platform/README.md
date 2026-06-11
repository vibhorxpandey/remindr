# Veil Content Studio

A self-contained content platform for **Veil — Research AI Platform** (veilresearch.com / [@veilresearch](https://www.instagram.com/veilresearch)) with Instagram-ready, downloadable brand assets. The copy is built around the live product: five AI modes (Research, Biology, Flywheel, Write, Mathematics), 1000+ ready-to-run workflows, always-on agents, bring-your-own keys/compute, and 2,400+ researchers in early access.

## What's inside

| | |
|---|---|
| `index.html` | The download hub — filterable galleries, hover video previews, one-click caption copy, and the June 2026 trend report with the million-view reel playbook. |
| `assets/images/` | 25 PNGs: 4 quote cards, 4 platform-fact posts, 4 reel covers, 4 feature-drop cards, a 6-slide carousel ("5 AI modes. One workspace."), 3 story templates. Feed posts are 1080×1350 (4:5), covers/stories 1080×1920 (9:16). |
| `assets/videos/` | 8 reels (1080×1920 MP4, 30fps, 9–12s): brand intro, 5-tabs pain hook, five-modes listicle, workflows drop, 50-papers demo hook, POV always-on agents, your-compute setup, early-access teaser. |
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
