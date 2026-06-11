#!/usr/bin/env python3
"""Veil Content Studio - asset generator.

Generates the downloadable brand content for the Veil AI content platform:
  - 25 Instagram-ready images (posts 1080x1350, reel covers / stories 1080x1920)
  - 8 reel videos (1080x1920 mp4, animated gradient + timed text overlays)

Run from the repo root or this directory:
    python3 content-platform/generate_assets.py
Requires: Pillow, ffmpeg (videos only).
"""

import math
import os
import shutil
import subprocess
import tempfile

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(HERE, "assets", "images")
VID_DIR = os.path.join(HERE, "assets", "videos")

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

# Brand palette - deep "veil" purples with an electric accent.
INK = (11, 7, 22)          # near-black indigo
DEEP = (24, 13, 56)        # deep violet
VIOLET = (124, 58, 237)    # primary accent
FUCHSIA = (217, 70, 239)   # secondary accent
CYAN = (34, 211, 238)      # highlight
WHITE = (245, 243, 255)
MUTED = (167, 158, 196)

POST = (1080, 1350)
TALL = (1080, 1920)


def font(path, size):
    return ImageFont.truetype(path, size)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_bg(size, glow_color=VIOLET, second_glow=FUCHSIA):
    """Vertical INK→DEEP gradient with two soft glows added on top."""
    w, h = size
    strip = Image.new("RGB", (1, h))
    for y in range(h):
        strip.putpixel((0, y), lerp(INK, DEEP, y / h))
    img = strip.resize(size)
    glow = Image.new("RGB", size, (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([int(w * 0.55), -int(h * 0.18), int(w * 1.35), int(h * 0.42)],
               fill=tuple(int(c * 0.55) for c in glow_color))
    gd.ellipse([-int(w * 0.35), int(h * 0.62), int(w * 0.45), int(h * 1.25)],
               fill=tuple(int(c * 0.4) for c in second_glow))
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    return ImageChops.add(img, glow)


def grid_overlay(img, step=120, alpha=14):
    """Faint grid for a techy texture."""
    w, h = img.size
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=(255, 255, 255, alpha), width=1)
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=(255, 255, 255, alpha), width=1)
    img.paste(layer, (0, 0), layer)
    return img


def draw_logo(d, x, y, scale=1.0, with_word=True):
    """Veil glyph: two overlapping translucent triangles (a 'veil') + wordmark."""
    s = int(56 * scale)
    d.polygon([(x, y + s), (x + s // 2, y), (x + s, y + s)], outline=CYAN, width=max(2, int(3 * scale)))
    d.polygon([(x + s // 3, y + s), (x + s // 3 + s // 2, y), (x + s // 3 + s, y + s)],
              outline=FUCHSIA, width=max(2, int(3 * scale)))
    if with_word:
        f = font(FONT_BOLD, int(44 * scale))
        d.text((x + s + s // 2 + int(10 * scale), y + s // 2), "VEIL",
               font=f, fill=WHITE, anchor="lm")


def footer(d, size, handle="@veilresearch", tag="veilresearch.com"):
    w, h = size
    f = font(FONT_REG, 30)
    d.text((70, h - 70), handle, font=f, fill=MUTED, anchor="lm")
    d.text((w - 70, h - 70), tag, font=f, fill=MUTED, anchor="rm")
    d.line([(70, h - 110), (w - 70, h - 110)], fill=(255, 255, 255, 30), width=1)


def wrap(d, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_block(d, text, fnt, x, y, max_w, fill=WHITE, line_gap=1.18, anchor_center=False, w=None):
    lines = wrap(d, text, fnt, max_w)
    lh = int(fnt.size * line_gap)
    for i, line in enumerate(lines):
        if anchor_center:
            d.text((w // 2, y + i * lh), line, font=fnt, fill=fill, anchor="ma")
        else:
            d.text((x, y + i * lh), line, font=fnt, fill=fill)
    return y + len(lines) * lh


def chip(d, x, y, label, color=VIOLET):
    f = font(FONT_BOLD, 30)
    tw = d.textlength(label, font=f)
    pad = 28
    d.rounded_rectangle([x, y, x + tw + pad * 2, y + 64], radius=32,
                        outline=color, width=2)
    d.text((x + pad, y + 32), label, font=f, fill=color, anchor="lm")
    return x + tw + pad * 2


def accent_bar(d, x, y, w=160, h=10):
    seg = w // 3
    d.rounded_rectangle([x, y, x + seg, y + h], radius=h // 2, fill=VIOLET)
    d.rounded_rectangle([x + seg + 12, y, x + 2 * seg + 12, y + h], radius=h // 2, fill=FUCHSIA)
    d.rounded_rectangle([x + 2 * seg + 24, y, x + w + 24, y + h], radius=h // 2, fill=CYAN)


def new_canvas(size):
    img = make_bg(size)
    grid_overlay(img)
    return img, ImageDraw.Draw(img, "RGBA")


def save(img, name):
    path = os.path.join(IMG_DIR, name)
    img.save(path, "PNG", optimize=True)
    print("  image:", name)


# ---------------------------------------------------------------- image sets

def quote_cards():
    quotes = [
        ("Five tools shattered my flow. So I built one.", "FROM THE FOUNDER"),
        ("Your AI should hold the full context of your work, not just the last message.", "THE VEIL THESIS"),
        ("Research smarter. Build stronger models.", "THE VEIL MANTRA"),
        ("Switch modes mid-session. Lose nothing.", "CONTEXT IS EVERYTHING"),
    ]
    for i, (q, kicker) in enumerate(quotes, 1):
        img, d = new_canvas(POST)
        w, h = POST
        draw_logo(d, 70, 70)
        chip(d, w - 330, 78, "VEIL AI", CYAN)
        d.text((w // 2, int(h * 0.30)), kicker, font=font(FONT_BOLD, 34),
               fill=CYAN, anchor="ma")
        d.text((80, int(h * 0.20)), "“", font=font(FONT_SERIF, 200), fill=FUCHSIA)
        draw_block(d, q, font(FONT_SERIF, 76), 0, int(h * 0.40), w - 280,
                   anchor_center=True, w=w)
        accent_bar(d, w // 2 - 92, int(h * 0.78))
        d.text((w // 2, int(h * 0.83)), "One workspace. Five modes. → veilresearch.com",
               font=font(FONT_REG, 32), fill=MUTED, anchor="ma")
        footer(d, POST)
        save(img, f"quote-card-{i:02d}.png")


def stat_cards():
    stats = [
        ("5", "expert AI modes in one workspace: Research, Biology, Flywheel, Write, Mathematics.",
         "Switch instantly. Keep everything."),
        ("1000+", "ready-to-run pipelines: literature synthesis, AlphaFold runs, fine-tunes, LaTeX drafts.",
         "Use them as-is or adapt them."),
        ("2,400+", "researchers are already inside Early Access.",
         "The waitlist is open."),
        ("0", "config needed. The sandboxed runtime handles packages, environments and GPUs.",
         "Jump straight into research."),
    ]
    for i, (big, line, src) in enumerate(stats, 1):
        img, d = new_canvas(POST)
        w, h = POST
        draw_logo(d, 70, 70)
        chip(d, w - 410, 78, "VEIL IN NUMBERS", FUCHSIA)
        d.text((w // 2, int(h * 0.26)), big, font=font(FONT_BOLD, 230), fill=WHITE, anchor="ma")
        accent_bar(d, w // 2 - 92, int(h * 0.47))
        draw_block(d, line, font(FONT_BOLD, 56), 0, int(h * 0.53), w - 240,
                   anchor_center=True, w=w)
        d.text((w // 2, int(h * 0.78)), src, font=font(FONT_REG, 28), fill=MUTED, anchor="ma")
        d.text((w // 2, int(h * 0.84)), "Open the dashboard → veilresearch.com",
               font=font(FONT_REG, 32), fill=CYAN, anchor="ma")
        footer(d, POST)
        save(img, f"stat-card-{i:02d}.png")


def reel_covers():
    covers = [
        ("POV:", "Your literature review finishes while you sleep", "WATCH TILL THE END"),
        ("50 PAPERS", "synthesized into one survey. One prompt.", "SAVE THIS"),
        ("I MADE AI", "read 50 papers so I didn't have to…", "PART 1"),
        ("STOP", "juggling 5 tabs to do one research task.", "60 SECONDS"),
    ]
    for i, (big, sub, badge) in enumerate(covers, 1):
        img, d = new_canvas(TALL)
        w, h = TALL
        draw_logo(d, 70, 90)
        chip(d, w - 70 - int(d.textlength(badge, font=font(FONT_BOLD, 30))) - 56, 98, badge, CYAN)
        d.text((w // 2, int(h * 0.32)), big, font=font(FONT_BOLD, 150), fill=WHITE, anchor="ma")
        accent_bar(d, w // 2 - 92, int(h * 0.43))
        draw_block(d, sub, font(FONT_BOLD, 64), 0, int(h * 0.47), w - 220,
                   anchor_center=True, w=w)
        d.rounded_rectangle([w // 2 - 270, int(h * 0.72), w // 2 + 270, int(h * 0.72) + 96],
                            radius=48, fill=VIOLET)
        d.text((w // 2, int(h * 0.72) + 48), "veilresearch.com",
               font=font(FONT_BOLD, 40), fill=WHITE, anchor="mm")
        footer(d, TALL)
        save(img, f"reel-cover-{i:02d}.png")


def feature_cards():
    feats = [
        ("NEW", "Five Modes",
         "Research, Biology, Flywheel, Write, Mathematics - switch mid-session without losing any context."),
        ("NEW", "1000+ Workflows",
         "Ready-to-run pipelines for literature synthesis, protein analysis, fine-tuning and paper drafting."),
        ("NEW", "Always-On Agents",
         "Kick off a training run or literature review, close the browser - your agents keep going."),
        ("NEW", "Your Compute",
         "Wire GitHub, Hugging Face, W&B and Modal once - credentials flow to every agent automatically."),
    ]
    for i, (badge, title, body) in enumerate(feats, 1):
        img, d = new_canvas(POST)
        w, h = POST
        draw_logo(d, 70, 70)
        chip(d, 70, int(h * 0.24), badge, CYAN if badge == "NEW" else FUCHSIA)
        d.text((70, int(h * 0.33)), title, font=font(FONT_BOLD, 88), fill=WHITE)
        accent_bar(d, 74, int(h * 0.43))
        draw_block(d, body, font(FONT_REG, 44), 70, int(h * 0.48), w - 200, fill=MUTED)
        d.rounded_rectangle([70, int(h * 0.74), 70 + 480, int(h * 0.74) + 92],
                            radius=46, fill=VIOLET)
        d.text((70 + 240, int(h * 0.74) + 46), "Try it → veilresearch.com",
               font=font(FONT_BOLD, 34), fill=WHITE, anchor="mm")
        footer(d, POST)
        save(img, f"feature-card-{i:02d}.png")


def carousel():
    slides = [
        ("COVER", "5 AI modes. One workspace.", "(inside Veil Research)", None),
        ("01", "Research", None,
         "Full-cycle automation: hypotheses, literature synthesis, experiment planning, GPU training, manuscript drafts."),
        ("02", "Biology", None,
         "Protein design, genomics, pathway analysis and biomedical reasoning - wet-lab and computational."),
        ("03", "Flywheel", None,
         "Turn production usage into compounding model gains: auto fine-tunes, evals, continuous shipping."),
        ("04", "Write", None,
         "Rough notes to publication-ready papers: structured arguments, fact-checked citations, clean LaTeX."),
        ("05", "Mathematics", None,
         "Arithmetic to research-level math: step-by-step working, formal proofs, KaTeX rendering, graphs."),
    ]
    n = len(slides)
    for i, (num, title, sub, body) in enumerate(slides, 1):
        img, d = new_canvas(POST)
        w, h = POST
        draw_logo(d, 70, 70)
        d.text((w - 70, 100), f"{i}/{n}", font=font(FONT_BOLD, 36), fill=MUTED, anchor="rm")
        if num == "COVER":
            chip(d, 70, int(h * 0.26), "PLATFORM TOUR", CYAN)
            draw_block(d, title, font(FONT_BOLD, 104), 70, int(h * 0.35), w - 160)
            d.text((70, int(h * 0.62)), sub, font=font(FONT_REG, 48), fill=MUTED)
            d.text((70, int(h * 0.74)), "Swipe →", font=font(FONT_BOLD, 44), fill=CYAN)
        else:
            d.text((70, int(h * 0.22)), num, font=font(FONT_BOLD, 200),
                   fill=(124, 58, 237, 90))
            d.text((70, int(h * 0.45)), title, font=font(FONT_BOLD, 96), fill=WHITE)
            accent_bar(d, 74, int(h * 0.55))
            draw_block(d, body, font(FONT_REG, 44), 70, int(h * 0.60), w - 200, fill=MUTED)
            if i == n:
                d.text((70, int(h * 0.82)), "Try every mode → veilresearch.com",
                       font=font(FONT_BOLD, 36), fill=CYAN)
        footer(d, POST)
        save(img, f"carousel-modes-{i:02d}.png")


def story_templates():
    img, d = new_canvas(TALL)
    w, h = TALL
    draw_logo(d, 70, 90)
    chip(d, 70, int(h * 0.20), "EARLY ACCESS", CYAN)
    draw_block(d, "2,400+ researchers are already inside.",
               font(FONT_BOLD, 84), 70, int(h * 0.27), w - 180)
    draw_block(d, "Research. Write. Train. One workspace. Be next.",
               font(FONT_REG, 44), 70, int(h * 0.52), w - 200, fill=MUTED)
    d.rounded_rectangle([70, int(h * 0.66), w - 70, int(h * 0.66) + 130],
                        radius=65, outline=FUCHSIA, width=3)
    d.text((w // 2, int(h * 0.66) + 65), "LINK IN BIO → veilresearch.com",
           font=font(FONT_BOLD, 44), fill=WHITE, anchor="mm")
    footer(d, TALL)
    save(img, "story-waitlist-01.png")

    img, d = new_canvas(TALL)
    draw_logo(d, 70, 90)
    chip(d, 70, int(h * 0.18), "Q&A", VIOLET)
    draw_block(d, "Ask me anything about AI research workflows.",
               font(FONT_BOLD, 88), 70, int(h * 0.25), w - 180)
    d.rounded_rectangle([70, int(h * 0.50), w - 70, int(h * 0.50) + 220],
                        radius=36, fill=(255, 255, 255, 18))
    d.text((w // 2, int(h * 0.50) + 110), "[ question sticker here ]",
           font=font(FONT_REG, 40), fill=MUTED, anchor="mm")
    d.text((70, int(h * 0.72)), "Best ones get a live pipeline demo.",
           font=font(FONT_REG, 40), fill=CYAN)
    footer(d, TALL)
    save(img, "story-qna-02.png")

    img, d = new_canvas(TALL)
    draw_logo(d, 70, 90)
    chip(d, 70, int(h * 0.18), "THIS OR THAT", FUCHSIA)
    draw_block(d, "Pick your research bottleneck:", font(FONT_BOLD, 92), 70, int(h * 0.25), w - 180)
    for j, (label, y) in enumerate([("Reading papers", 0.44), ("Training models", 0.58)]):
        d.rounded_rectangle([70, int(h * y), w - 70, int(h * y) + 150], radius=36,
                            outline=CYAN if j else VIOLET, width=3)
        d.text((w // 2, int(h * y) + 75), label, font=font(FONT_BOLD, 56),
               fill=WHITE, anchor="mm")
    d.text((70, int(h * 0.72)), "Tap to vote. Results tomorrow.",
           font=font(FONT_REG, 40), fill=MUTED)
    footer(d, TALL)
    save(img, "story-poll-03.png")


# ---------------------------------------------------------------- video gen

def overlay_frame(lines, sub=None, badge=None, cta=None):
    """Transparent 1080x1920 text frame used as a timed ffmpeg overlay."""
    img = Image.new("RGBA", TALL, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    w, h = TALL
    draw_logo(d, 70, 90)
    y = int(h * 0.36)
    if badge:
        f = font(FONT_BOLD, 34)
        tw = d.textlength(badge, font=f)
        d.rounded_rectangle([w // 2 - tw / 2 - 30, y - 110, w // 2 + tw / 2 + 30, y - 40],
                            radius=35, outline=CYAN, width=2)
        d.text((w // 2, y - 75), badge, font=f, fill=CYAN, anchor="mm")
    f = font(FONT_BOLD, 92)
    for line in lines:
        size = 92
        f = font(FONT_BOLD, size)
        while d.textlength(line, font=f) > w - 160 and size > 48:
            size -= 4
            f = font(FONT_BOLD, size)
        d.text((w // 2, y), line, font=f, fill=WHITE, anchor="ma")
        y += int(f.size * 1.25)
    if sub:
        y += 30
        for sl in wrap(d, sub, font(FONT_REG, 46), w - 240):
            d.text((w // 2, y), sl, font=font(FONT_REG, 46), fill=MUTED, anchor="ma")
            y += 60
    if cta:
        d.rounded_rectangle([w // 2 - 300, int(h * 0.70), w // 2 + 300, int(h * 0.70) + 100],
                            radius=50, fill=VIOLET + (255,))
        d.text((w // 2, int(h * 0.70) + 50), cta, font=font(FONT_BOLD, 40),
               fill=WHITE, anchor="mm")
    d.text((w // 2, h - 140), "@veilresearch", font=font(FONT_REG, 34),
           fill=MUTED, anchor="mm")
    return img


def render_video(name, scenes, duration=None, colors=("0x0B0716", "0x2A1463", "0x7C3AED")):
    """scenes: list of (overlay_png_image, start, end). Animated gradient bg."""
    duration = duration or max(e for _, _, e in scenes) + 0.4
    tmp = tempfile.mkdtemp()
    inputs, filters = [], []
    bg = (f"gradients=size=1080x1920:speed=0.035:nb_colors=3:"
          f"c0={colors[0]}:c1={colors[1]}:c2={colors[2]}:duration={duration}:rate=30")
    cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i", bg]
    for i, (frame, _, _) in enumerate(scenes):
        p = os.path.join(tmp, f"ov{i}.png")
        frame.save(p)
        cmd += ["-loop", "1", "-t", str(duration), "-i", p]
    prev = "0:v"
    fc = []
    for i, (_, st, en) in enumerate(scenes):
        fade = (f"[{i + 1}:v]format=rgba,"
                f"fade=t=in:st={st}:d=0.35:alpha=1,"
                f"fade=t=out:st={max(st, en - 0.35)}:d=0.35:alpha=1[ov{i}];")
        merge = f"[{prev}][ov{i}]overlay=0:0:enable='between(t,{st},{en})'[v{i}];"
        fc.append(fade + merge)
        prev = f"v{i}"
    filter_complex = "".join(fc).rstrip(";")
    out = os.path.join(VID_DIR, name)
    cmd += ["-filter_complex", filter_complex, "-map", f"[{prev}]",
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
            "-t", str(duration), "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.rmtree(tmp)
    print("  video:", name)


def videos():
    render_video("reel-01-brand-intro.mp4", [
        (overlay_frame(["VEIL"], sub="The Research AI Platform. Research. Write. Train.", badge="INTRODUCING"), 0.3, 4.2),
        (overlay_frame(["One workspace.", "Five modes."], cta="veilresearch.com"), 4.4, 8.5),
    ])
    render_video("reel-02-five-tabs-hook.mp4", [
        (overlay_frame(["Doing research", "across 5 tabs?"], badge="HARD TRUTH"), 0.3, 3.6),
        (overlay_frame(["Every switch", "wipes your context."]), 3.8, 6.6),
        (overlay_frame(["Keep it all.", "One workspace."], cta="veilresearch.com"), 6.8, 9.6),
    ])
    render_video("reel-03-five-modes.mp4", [
        (overlay_frame(["5 AI modes.", "One workspace."], badge="SAVE THIS"), 0.3, 3.2),
        (overlay_frame(["Research. Biology.", "Flywheel."]), 3.4, 5.6),
        (overlay_frame(["Write.", "Mathematics."]), 5.8, 8.0),
        (overlay_frame(["Switch mid-session.", "Lose nothing."], cta="veilresearch.com"), 8.2, 11.4),
    ])
    render_video("reel-04-workflows.mp4", [
        (overlay_frame(["1000+ research", "pipelines"], badge="FEATURE DROP", sub="Literature synthesis. AlphaFold runs. Fine-tunes. LaTeX drafts."), 0.3, 4.4),
        (overlay_frame(["Ready to run.", "Zero config."], cta="Launch a workflow"), 4.6, 8.4),
    ])
    render_video("reel-05-50-papers.mp4", [
        (overlay_frame(["50 papers."], sub="Synthesized into one survey, with the open research gaps flagged.", badge="ONE PROMPT"), 0.3, 4.2),
        (overlay_frame(["Your literature", "review, automated."], cta="Try → veilresearch.com"), 4.4, 8.2),
    ])
    render_video("reel-06-pov-trend.mp4", [
        (overlay_frame(["POV:"], badge="WAIT FOR IT"), 0.3, 2.4),
        (overlay_frame(["Your training run kept going", "after you closed the laptop."]), 2.6, 6.0),
        (overlay_frame(["Always-on agents.", "Results in your dashboard."], cta="veilresearch.com"), 6.2, 9.4),
    ])
    render_video("reel-07-your-compute.mp4", [
        (overlay_frame(["Your keys.", "Your compute."], badge="ONE-TIME SETUP"), 0.3, 3.8),
        (overlay_frame(["GitHub. Hugging Face.", "W&B. Modal."]), 4.0, 6.6),
        (overlay_frame(["Wired once. Flows", "to every agent."], cta="Set up in minutes"), 6.8, 9.8),
    ])
    render_video("reel-08-early-access.mp4", [
        (overlay_frame(["2,400+", "researchers"], badge="EARLY ACCESS", sub="are already running experiments, reviews and training inside Veil."), 0.3, 4.4),
        (overlay_frame(["The waitlist", "is open."], cta="Link in bio"), 4.6, 8.4),
    ])


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    os.makedirs(VID_DIR, exist_ok=True)
    print("Generating images...")
    quote_cards()
    stat_cards()
    reel_covers()
    feature_cards()
    carousel()
    story_templates()
    print("Generating videos...")
    videos()
    print("Done.")


if __name__ == "__main__":
    main()
