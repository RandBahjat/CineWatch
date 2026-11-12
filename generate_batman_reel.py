# -*- coding: utf-8 -*-
"""
Generate an ultra-cinematic 1080x1920 (9:16) MP4 Instagram Reel for Christopher Nolan's
Dark Knight Trilogy on CineWatch.
"""

import os
import sys
import subprocess
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
FPS = 30
DURATION = 18.5  # seconds
TOTAL_FRAMES = int(FPS * DURATION)  # 555 frames

def create_rounded_mask(size, radius):
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), size], radius=radius, fill=255)
    return mask

def ease_in_out(t):
    return t * t * (3.0 - 2.0 * t)

def ease_out(t):
    return 1.0 - (1.0 - t) ** 3

def prepare_poster(path, size, border_color=(65, 80, 105, 200), border_w=2, glow=False):
    pw, ph = size
    img = Image.open(path).convert('RGBA')
    img = img.resize((pw, ph), Image.Resampling.LANCZOS)
    
    # Shadow
    pad = 50
    composite = Image.new('RGBA', (pw + pad*2, ph + pad*2), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(composite)
    s_draw.rounded_rectangle([(pad - 12, pad + 12), (pad + pw + 12, pad + ph + 28)], radius=24, fill=(0, 0, 0, 190))
    composite = composite.filter(ImageFilter.GaussianBlur(24))

    # Optional golden glow
    if glow:
        glow_layer = Image.new('RGBA', (pw + pad*2, ph + pad*2), (0, 0, 0, 0))
        g_draw = ImageDraw.Draw(glow_layer)
        g_draw.rounded_rectangle([(pad - 10, pad - 10), (pad + pw + 10, pad + ph + 10)], radius=24, fill=(225, 175, 50, 80))
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(14))
        composite = Image.alpha_composite(composite, glow_layer)

    # Poster with rounded mask
    mask = create_rounded_mask((pw, ph), radius=16)
    composite.paste(img, (pad, pad), mask)

    # Border
    c_draw = ImageDraw.Draw(composite)
    c_draw.rounded_rectangle([(pad, pad), (pad + pw, pad + ph)], radius=16, outline=border_color, width=border_w)

    # 4K Badge
    bw, bh = 56, 24
    bx, by = pad + pw - bw - 12, pad + 12
    c_draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=6, fill=(10, 12, 18, 230), outline=(225, 175, 50, 255), width=1)
    badge_font = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 14)
    c_draw.text((bx + 11, by + 4), "4K", fill=(255, 255, 255, 255), font=badge_font)

    return composite, pad

def make_intro_card():
    card = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)

    font_brand = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 24)
    font_main = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 58)
    font_gold = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 54)
    font_sub = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 24)
    font_badge = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 16)

    # Brand
    brand_text = "C I N E W A T C H   P R E S E N T S"
    bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 580), brand_text, fill=(225, 175, 50, 255), font=font_brand)

    # Line
    draw.line([(W//2 - 120, 630), (W//2 + 120, 630)], fill=(225, 175, 50, 180), width=2)

    # Title
    t1 = "THE DARK KNIGHT"
    bbox = draw.textbbox((0, 0), t1, font=font_main)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 670), t1, fill=(255, 255, 255, 255), font=font_main)

    t2 = "T  R  I  L  O  G  Y"
    bbox = draw.textbbox((0, 0), t2, font=font_gold)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 745), t2, fill=(225, 175, 50, 255), font=font_gold)

    # Subtitle
    sub = "CHRISTOPHER NOLAN'S LEGENDARY MASTERPIECE"
    bbox = draw.textbbox((0, 0), sub, font=font_sub)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 850), sub, fill=(190, 210, 235, 255), font=font_sub)

    # Badge Pill
    pill_w, pill_h = 600, 50
    pill_x = (W - pill_w) // 2
    pill_y = 930
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=25, fill=(18, 26, 38, 225), outline=(55, 82, 118, 255), width=2)
    pill_text = "NOW STREAMING IN 4K UHD IMAX"
    bbox = draw.textbbox((0, 0), pill_text, font=font_badge)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, pill_y + 14), pill_text, fill=(240, 245, 255, 255), font=font_badge)

    return card

def make_film_card(part_label, title, tagline, stars, specs_label):
    card = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)

    font_part = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 20)
    font_title = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 44)
    font_tag = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 22)
    font_stars = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 17)
    font_specs = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 15)

    # Part Badge Pill
    pill_w, pill_h = 240, 38
    pill_x = (W - pill_w) // 2
    pill_y = 1200
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=19, fill=(225, 175, 50, 230))
    bbox = draw.textbbox((0, 0), part_label, font=font_part)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, pill_y + 7), part_label, fill=(10, 12, 16, 255), font=font_part)

    # Film Title
    bbox = draw.textbbox((0, 0), title, font=font_title)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 1260), title, fill=(255, 255, 255, 255), font=font_title)

    # Tagline
    bbox = draw.textbbox((0, 0), tagline, font=font_tag)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 1320), tagline, fill=(225, 175, 50, 255), font=font_tag)

    # Stars
    bbox = draw.textbbox((0, 0), stars, font=font_stars)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 1365), stars, fill=(185, 205, 230, 255), font=font_stars)

    # Specs Box
    spec_w, spec_h = 580, 44
    spec_x = (W - spec_w) // 2
    spec_y = 1420
    draw.rounded_rectangle([(spec_x, spec_y), (spec_x + spec_w, spec_y + spec_h)], radius=22, fill=(18, 25, 38, 220), outline=(50, 75, 110, 255), width=1)
    bbox = draw.textbbox((0, 0), specs_label, font=font_specs)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, spec_y + 12), specs_label, fill=(235, 245, 255, 255), font=font_specs)

    return card

def make_finale_card():
    card = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)

    font_brand = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 22)
    font_main = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 44)
    font_sub = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 20)
    font_feat = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 19)
    font_cta = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 26)
    font_foot = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 19)

    # Top Brand
    brand_text = "C I N E W A T C H   E X C L U S I V E"
    bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 150), brand_text, fill=(225, 175, 50, 255), font=font_brand)

    # Main Title
    title = "THE COMPLETE TRILOGY"
    bbox = draw.textbbox((0, 0), title, font=font_main)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 195), title, fill=(255, 255, 255, 255), font=font_main)

    sub = "ALL 3 FILMS AVAILABLE NOW IN 4K UHD"
    bbox = draw.textbbox((0, 0), sub, font=font_sub)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 255), sub, fill=(185, 205, 230, 255), font=font_sub)

    # Features Card
    feat_y = 1200
    features = [
        "\u2714  Mastered in 4K HEVC 10-Bit",
        "\u2714  Full Shifting IMAX Sequences",
        "\u2714  English Dolby 5.1 Surround",
        "\u2714  English & Kurdish Subtitles"
    ]
    box_w, box_h = 840, 190
    box_x = (W - box_w) // 2
    draw.rounded_rectangle([(box_x, feat_y), (box_x + box_w, feat_y + box_h)], radius=20, fill=(16, 22, 32, 225), outline=(50, 75, 110, 255), width=1)
    for i, f in enumerate(features):
        fx = box_x + 45 + (i % 2) * 410
        fy = feat_y + 35 + (i // 2) * 70
        draw.text((fx, fy), f, fill=(225, 235, 245, 255), font=font_feat)

    # CTA Button
    cta_w, cta_h = 720, 80
    cta_x = (W - cta_w) // 2
    cta_y = 1490
    draw.rounded_rectangle([(cta_x, cta_y), (cta_x + cta_w, cta_y + cta_h)], radius=40, fill=(225, 165, 35, 255))
    cta_text = "STREAM NOW FOR FREE"
    bbox = draw.textbbox((0, 0), cta_text, font=font_cta)
    draw.text((cta_x + (cta_w - (bbox[2] - bbox[0])) // 2, cta_y + 22), cta_text, fill=(10, 12, 16, 255), font=font_cta)

    # Footer
    foot = "No Subscription Required  \u2022  Link in Bio"
    bbox = draw.textbbox((0, 0), foot, font=font_foot)
    draw.text(((W - (bbox[2] - bbox[0])) // 2, 1605), foot, fill=(160, 180, 205, 255), font=font_foot)

    return card

def load_backdrop(path):
    img = Image.open(path).convert('RGBA')
    # Scale to cover W x H with margin for zoom
    scale = max((W * 1.15) / img.width, (H * 1.15) / img.height)
    new_w, new_h = int(img.width * scale), int(img.height * scale)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    return img

def render_reel():
    print("[1/5] Pre-rendering high-resolution cards and assets...")
    
    # Pre-render cards
    intro_card = make_intro_card()
    card_bb = make_film_card("PART 1  \u2022  2005", "BATMAN BEGINS", "WHERE THE LEGEND BEGAN", "CHRISTIAN BALE  \u2022  LIAM NEESON  \u2022  MICHAEL CAINE", "4K ULTRA HD  \u2022  5.1 SURROUND SOUND")
    card_tdk = make_film_card("PART 2  \u2022  2008", "THE DARK KNIGHT", "HEATH LEDGER'S ICONIC JOKER", "EXPANDED 1.78:1 IMAX SEQUENCES", "4K ULTRA HD  \u2022  FULL IMAX 70MM")
    card_tdkr = make_film_card("PART 3  \u2022  2012", "THE DARK KNIGHT RISES", "THE EPIC CONCLUSION", "TOM HARDY AS BANE  \u2022  ANNE HATHAWAY", "4K ULTRA HD  \u2022  EXPANDED IMAX AUDIO")
    finale_card = make_finale_card()

    # Pre-render solo big posters for scenes 1, 2, 3 (size 460 x 690)
    poster_bb_big, pad_bb = prepare_poster('batman_promo_assets/bb_poster.jpg', (460, 690), (70, 90, 120, 220), 2)
    poster_tdk_big, pad_tdk = prepare_poster('batman_promo_assets/tdk_poster.jpg', (460, 690), (225, 175, 50, 255), 3, glow=True)
    poster_tdkr_big, pad_tdkr = prepare_poster('batman_promo_assets/tdkr_poster.jpg', (460, 690), (70, 90, 120, 220), 2)

    # Pre-render 3 finale posters (side: 280x420, center: 330x495)
    f_bb, f_pad_bb = prepare_poster('batman_promo_assets/bb_poster.jpg', (280, 420), (65, 80, 105, 200), 1)
    f_tdk, f_pad_tdk = prepare_poster('batman_promo_assets/tdk_poster.jpg', (330, 495), (225, 175, 50, 255), 3, glow=True)
    f_tdkr, f_pad_tdkr = prepare_poster('batman_promo_assets/tdkr_promo.jpg' if os.path.exists('batman_promo_assets/tdkr_promo.jpg') else 'batman_promo_assets/tdkr_poster.jpg', (280, 420), (65, 80, 105, 200), 1)

    # Pre-load backdrops
    bd_tdk = load_backdrop('batman_promo_assets/tdk_backdrop.jpg')
    bd_bb = load_backdrop('batman_promo_assets/bb_backdrop.jpg')
    bd_tdkr = load_backdrop('batman_promo_assets/tdkr_backdrop.jpg')

    # Global dark overlay
    dark_overlay = Image.new('RGBA', (W, H), (8, 10, 15, 200))
    dark_overlay_heavy = Image.new('RGBA', (W, H), (8, 10, 15, 225))

    # Pre-render ambient fogs
    fog_blue = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fog_blue_draw = ImageDraw.Draw(fog_blue)
    fog_blue_draw.ellipse([W//2 - 450, 200, W//2 + 450, 1100], fill=(20, 60, 110, 60))
    fog_blue = fog_blue.filter(ImageFilter.GaussianBlur(90))

    fog_gold = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fog_gold_draw = ImageDraw.Draw(fog_gold)
    fog_gold_draw.ellipse([W//2 - 400, 300, W//2 + 400, 1200], fill=(210, 150, 35, 45))
    fog_gold = fog_gold.filter(ImageFilter.GaussianBlur(90))

    # FFmpeg process output
    output_mp4 = "batman_trilogy_instagram_reel.mp4"
    audio_aac = "batman_reel_audio.aac"

    print("[2/5] Synthesizing cinematic orchestral audio bed with FFmpeg...", flush=True)
    # Create cinematic bass drone + harmonic chord + acoustic echo
    audio_cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"sine=frequency=55:duration={DURATION}",
        "-f", "lavfi", "-i", f"sine=frequency=110:duration={DURATION}",
        "-f", "lavfi", "-i", f"sine=frequency=165:duration={DURATION}",
        "-filter_complex",
        "[0:a]volume=0.40[b1];[1:a]volume=0.25[b2];[2:a]volume=0.15[b3];"
        f"[b1][b2][b3]amix=inputs=3:duration=shortest,aecho=0.8:0.88:60:0.4,"
        f"afade=t=in:st=0:d=1.5,afade=t=out:st={DURATION - 2.0}:d=2.0[aout]",
        "-map", "[aout]",
        "-c:a", "aac",
        "-b:a", "192k",
        audio_aac
    ]
    subprocess.run(audio_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    print("[3/5] Starting FFmpeg video encoding pipeline...", flush=True)
    # FFmpeg pipe command
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgba",
        "-r", str(FPS),
        "-i", "-",  # Video from stdin
        "-i", audio_aac,  # Audio from file
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        "-movflags", "+faststart",
        output_mp4
    ]

    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

    print(f"[4/5] Rendering and streaming {TOTAL_FRAMES} frames ({DURATION}s @ {FPS}fps)...")

    # Timeline layout (in seconds):
    # Scene 0: Intro (0.0 -> 3.6s)
    # Scene 1: Batman Begins (3.6 -> 7.3s)
    # Scene 2: The Dark Knight (7.3 -> 11.0s)
    # Scene 3: The Dark Knight Rises (11.0 -> 14.7s)
    # Scene 4: Finale & CTA (14.7 -> 18.5s)
    
    t0_end = 3.6
    t1_end = 7.3
    t2_end = 11.0
    t3_end = 14.7
    t4_end = 18.5
    fade_d = 0.5  # 15 frames transition crossfade

    for f_idx in range(TOTAL_FRAMES):
        t = f_idx / FPS

        # Determine active scene & local progress
        if t < t0_end:
            # SCENE 0: INTRO
            # Background zoom
            zoom = 1.0 + (t / t0_end) * 0.08
            cx = (bd_tdk.width - W) // 2
            cy = (bd_tdk.height - H) // 2 + int(math.sin(t * 0.8) * 15)
            frame_bg = bd_tdk.crop((cx, cy, cx + W, cy + H))
            frame_bg = Image.alpha_composite(frame_bg, dark_overlay)
            frame_bg = Image.alpha_composite(frame_bg, fog_gold)

            # Fade in intro card
            alpha = min(1.0, t / 0.8)
            if t > (t0_end - fade_d):
                alpha = max(0.0, (t0_end - t) / fade_d)
            
            # Subtle slide up
            offset_y = int((1.0 - ease_out(min(1.0, t / 1.0))) * 35)
            
            # Composite intro card
            intro_layer = intro_card.copy()
            if alpha < 0.99:
                intro_layer.putalpha(int(alpha * 255))
            frame_bg.paste(intro_layer, (0, -offset_y), intro_layer)

        elif t < t1_end:
            # SCENE 1: BATMAN BEGINS
            st = t - t0_end
            s_dur = t1_end - t0_end
            
            # Backdrop pan
            cx = (bd_bb.width - W) // 2 + int((st / s_dur) * 30)
            cy = (bd_bb.height - H) // 2
            frame_bg = bd_bb.crop((cx, cy, cx + W, cy + H))
            frame_bg = Image.alpha_composite(frame_bg, dark_overlay_heavy)
            frame_bg = Image.alpha_composite(frame_bg, fog_blue)

            # Poster position with gentle floating
            st_norm = min(1.0, st / 0.8)
            slide = int((1.0 - ease_out(st_norm)) * 50)
            float_y = int(math.sin(st * 2.0) * 8)
            
            poster_x = (W - (460 + pad_bb*2)) // 2
            poster_y = 440 - pad_bb + slide + float_y
            frame_bg.paste(poster_bb_big, (poster_x, poster_y), poster_bb_big)

            # Text Card
            alpha = min(1.0, st / 0.6)
            if st > (s_dur - fade_d):
                alpha = max(0.0, (s_dur - st) / fade_d)
            
            card_layer = card_bb.copy()
            if alpha < 0.99:
                card_layer.putalpha(int(alpha * 255))
            frame_bg.paste(card_layer, (0, 0), card_layer)

        elif t < t2_end:
            # SCENE 2: THE DARK KNIGHT
            st = t - t1_end
            s_dur = t2_end - t1_end

            cx = (bd_tdk.width - W) // 2
            cy = (bd_tdk.height - H) // 2 - int((st / s_dur) * 30)
            frame_bg = bd_tdk.crop((cx, cy, cx + W, cy + H))
            frame_bg = Image.alpha_composite(frame_bg, dark_overlay_heavy)
            frame_bg = Image.alpha_composite(frame_bg, fog_gold)

            st_norm = min(1.0, st / 0.8)
            slide = int((1.0 - ease_out(st_norm)) * 50)
            float_y = int(math.sin(st * 2.0) * 8)

            poster_x = (W - (460 + pad_tdk*2)) // 2
            poster_y = 440 - pad_tdk + slide + float_y
            frame_bg.paste(poster_tdk_big, (poster_x, poster_y), poster_tdk_big)

            alpha = min(1.0, st / 0.6)
            if st > (s_dur - fade_d):
                alpha = max(0.0, (s_dur - st) / fade_d)

            card_layer = card_tdk.copy()
            if alpha < 0.99:
                card_layer.putalpha(int(alpha * 255))
            frame_bg.paste(card_layer, (0, 0), card_layer)

        elif t < t3_end:
            # SCENE 3: THE DARK KNIGHT RISES
            st = t - t2_end
            s_dur = t3_end - t2_end

            cx = (bd_tdkr.width - W) // 2 - int((st / s_dur) * 30)
            cy = (bd_tdkr.height - H) // 2
            frame_bg = bd_tdkr.crop((cx, cy, cx + W, cy + H))
            frame_bg = Image.alpha_composite(frame_bg, dark_overlay_heavy)
            frame_bg = Image.alpha_composite(frame_bg, fog_blue)

            st_norm = min(1.0, st / 0.8)
            slide = int((1.0 - ease_out(st_norm)) * 50)
            float_y = int(math.sin(st * 2.0) * 8)

            poster_x = (W - (460 + pad_tdkr*2)) // 2
            poster_y = 440 - pad_tdkr + slide + float_y
            frame_bg.paste(poster_tdkr_big, (poster_x, poster_y), poster_tdkr_big)

            alpha = min(1.0, st / 0.6)
            if st > (s_dur - fade_d):
                alpha = max(0.0, (s_dur - st) / fade_d)

            card_layer = card_tdkr.copy()
            if alpha < 0.99:
                card_layer.putalpha(int(alpha * 255))
            frame_bg.paste(card_layer, (0, 0), card_layer)

        else:
            # SCENE 4: GRAND FINALE / CALL TO ACTION
            st = t - t3_end
            s_dur = t4_end - t3_end

            cx = (bd_tdk.width - W) // 2
            cy = (bd_tdk.height - H) // 2
            frame_bg = bd_tdk.crop((cx, cy, cx + W, cy + H))
            frame_bg = Image.alpha_composite(frame_bg, dark_overlay_heavy)
            frame_bg = Image.alpha_composite(frame_bg, fog_gold)

            # Slide in 3 posters
            st_norm = min(1.0, st / 0.9)
            slide = int((1.0 - ease_out(st_norm)) * 60)

            # Left poster: Batman Begins
            p1_x = 55 - f_pad_bb
            p1_y = 520 - f_pad_bb + slide
            frame_bg.paste(f_bb, (p1_x, p1_y), f_bb)

            # Right poster: The Dark Knight Rises
            p3_x = W - 55 - 280 - f_pad_tdkr
            p3_y = 520 - f_pad_tdkr + slide
            frame_bg.paste(f_tdkr, (p3_x, p3_y), f_tdkr)

            # Center elevated poster: The Dark Knight
            p2_x = (W - (330 + f_pad_tdk*2)) // 2
            p2_y = 480 - f_pad_tdk + slide + int(math.sin(st * 2.5) * 5)
            frame_bg.paste(f_tdk, (p2_x, p2_y), f_tdk)

            # Finale Card
            alpha = min(1.0, st / 0.7)
            if t > (t4_end - 0.6):
                alpha = max(0.0, (t4_end - t) / 0.6)

            card_layer = finale_card.copy()
            if alpha < 0.99:
                card_layer.putalpha(int(alpha * 255))
            frame_bg.paste(card_layer, (0, 0), card_layer)

        # Pipe raw bytes to ffmpeg
        proc.stdin.write(frame_bg.convert('RGBA').tobytes())

        if (f_idx + 1) % 90 == 0 or (f_idx + 1) == TOTAL_FRAMES:
            pct = int(((f_idx + 1) / TOTAL_FRAMES) * 100)
            print(f"Render progress: {pct}% ({f_idx + 1}/{TOTAL_FRAMES} frames)", flush=True)

    proc.stdin.close()
    proc.wait()

    if os.path.exists(audio_aac):
        os.remove(audio_aac)

    print("[5/5] Success! Video Reel created:", output_mp4, flush=True)

if __name__ == '__main__':
    render_reel()
