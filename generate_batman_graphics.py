# -*- coding: utf-8 -*-
"""
Generate ultra-high-resolution promotional graphics for Christopher Nolan's The Dark Knight Trilogy on CineWatch.
Outputs:
1. Portrait (4:5)  -> 1080 x 1350  (Standard Instagram Feed Post)
2. Square   (1:1)  -> 1080 x 1080  (Carousel / Square Grid)
3. Reel/Story (9:16) -> 1080 x 1920 (Instagram Story & Reel Cover)
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_rounded_mask(size, radius):
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), size], radius=radius, fill=255)
    return mask

def make_dark_knight_portrait():
    W, H = 1080, 1350
    bg = Image.new('RGBA', (W, H), (10, 12, 16, 255))
    
    # Load and blend Gotham backdrop
    backdrop_path = 'batman_promo_assets/tdk_backdrop.jpg'
    if os.path.exists(backdrop_path):
        bd = Image.open(backdrop_path).convert('RGBA')
        bd = bd.resize((W, int(W * bd.height / bd.width)))
        if bd.height < H:
            bd = bd.resize((int(H * bd.width / bd.height), H))
        left = (bd.width - W) // 2
        top = (bd.height - H) // 2
        bd = bd.crop((left, top, left + W, top + H))
        
        # Heavy dark vignette overlay so content stands out
        dark_overlay = Image.new('RGBA', (W, H), (8, 10, 15, 215))
        bd = Image.alpha_composite(bd, dark_overlay)
        bg = bd

    # Ambient Gotham lighting / glowing fog
    fog = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fog_draw = ImageDraw.Draw(fog)
    fog_draw.ellipse([W//2 - 450, -50, W//2 + 450, 400], fill=(20, 60, 110, 50))   # Gotham cool blue aura at top
    fog_draw.ellipse([W//2 - 350, 450, W//2 + 350, 1000], fill=(190, 140, 35, 30)) # Warm amber / fire glow behind TDK
    fog = fog.filter(ImageFilter.GaussianBlur(90))
    bg = Image.alpha_composite(bg, fog)
    draw = ImageDraw.Draw(bg)

    # Fonts
    font_brand = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 20)
    font_title = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 44)
    font_sub = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 20)
    font_year = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 17)
    font_movie_title = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 16)
    font_badge = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 14)
    font_feat = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 16)
    font_cta = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 22)
    font_tag = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 16)

    # 1. Header Section
    brand_text = "C I N E W A T C H   E X C L U S I V E"
    bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 50), brand_text, fill=(225, 175, 50, 255), font=font_brand)

    main_title = "THE DARK KNIGHT TRILOGY"
    bbox = draw.textbbox((0, 0), main_title, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 85), main_title, fill=(255, 255, 255, 255), font=font_title)

    sub_text = "CHRISTOPHER NOLAN'S MASTERPIECE IN 4K UHD"
    bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 142), sub_text, fill=(185, 205, 225, 255), font=font_sub)

    # Header Badges Pill
    pill_w = 480
    pill_h = 36
    pill_x = (W - pill_w) // 2
    pill_y = 180
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=18, fill=(22, 30, 44, 210), outline=(55, 80, 115, 255), width=1)
    
    pill_text = "4K ULTRA HD   \u2022   IMAX EXPANDED   \u2022   5.1 SURROUND"
    bbox = draw.textbbox((0, 0), pill_text, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, pill_y + 9), pill_text, fill=(230, 240, 255, 255), font=font_badge)

    # 2. Posters Layout (3 Posters side by side with depth & center emphasis)
    posters_data = [
        ("batman_promo_assets/bb_poster.jpg", "BATMAN BEGINS", "2005", 280, 420, 85, 330),
        ("batman_promo_assets/tdk_poster.jpg", "THE DARK KNIGHT", "2008", 320, 480, (W - 320) // 2, 300),
        ("batman_promo_assets/tdkr_poster.jpg", "THE DARK KNIGHT RISES", "2012", 280, 420, W - 85 - 280, 330)
    ]

    # Create shadows layer first
    shadows = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadows)

    for p_path, p_title, p_year, pw, ph, px, py in posters_data:
        shadow_draw.rounded_rectangle([(px - 15, py + 15), (px + pw + 15, py + ph + 30)], radius=25, fill=(0, 0, 0, 185))
    shadows = shadows.filter(ImageFilter.GaussianBlur(30))
    bg = Image.alpha_composite(bg, shadows)
    draw = ImageDraw.Draw(bg)

    # Paste posters (Left and Right first, then Center on top)
    render_order = [0, 2, 1]
    for idx in render_order:
        p_path, p_title, p_year, pw, ph, px, py = posters_data[idx]
        img = Image.open(p_path).convert('RGBA')
        img = img.resize((pw, ph), Image.Resampling.LANCZOS)
        
        # Golden glow for center poster
        if idx == 1:
            glow_box = Image.new('RGBA', (pw + 22, ph + 22), (0, 0, 0, 0))
            g_draw = ImageDraw.Draw(glow_box)
            g_draw.rounded_rectangle([(2, 2), (pw + 20, ph + 20)], radius=18, fill=(225, 175, 50, 65))
            glow_box = glow_box.filter(ImageFilter.GaussianBlur(8))
            bg.paste(glow_box, (px - 11, py - 11), glow_box)

        # Rounded corners mask
        mask = create_rounded_mask((pw, ph), radius=14)
        bg.paste(img, (px, py), mask)

        # Elegant border stroke
        stroke_color = (225, 175, 50, 240) if idx == 1 else (65, 80, 105, 200)
        border_w = 2 if idx == 1 else 1
        draw.rounded_rectangle([(px, py), (px + pw, py + ph)], radius=14, outline=stroke_color, width=border_w)

        # 4K Badge on poster top right
        badge_w, badge_h = 56, 24
        bx, by = px + pw - badge_w - 12, py + 12
        draw.rounded_rectangle([(bx, by), (bx + badge_w, by + badge_h)], radius=6, fill=(10, 12, 18, 220), outline=(225, 175, 50, 255), width=1)
        draw.text((bx + 11, by + 4), "4K", fill=(255, 255, 255, 255), font=font_badge)

        # Movie title below poster
        bbox = draw.textbbox((0, 0), p_title, font=font_movie_title)
        tw = bbox[2] - bbox[0]
        text_y = py + ph + 22
        draw.text((px + (pw - tw) // 2, text_y), p_title, fill=(255, 255, 255, 255), font=font_movie_title)

        # Year badge below title
        year_text = f"Part {idx + 1}  \u2022  {p_year}"
        bbox = draw.textbbox((0, 0), year_text, font=font_year)
        tw = bbox[2] - bbox[0]
        draw.text((px + (pw - tw) // 2, text_y + 24), year_text, fill=(225, 175, 50, 255), font=font_year)

    # 3. Features Highlight Bar
    feat_y = 880
    features = [
        "\u2714  Mastered in 4K HEVC 10-Bit",
        "\u2714  Full Shifting IMAX Sequences",
        "\u2714  Original English Dolby 5.1",
        "\u2714  English & Kurdish Subtitles"
    ]
    box_w, box_h = 760, 160
    box_x = (W - box_w) // 2
    draw.rounded_rectangle([(box_x, feat_y), (box_x + box_w, feat_y + box_h)], radius=16, fill=(16, 22, 32, 220), outline=(48, 65, 90, 255), width=1)
    
    for i, f in enumerate(features):
        fx = box_x + 40 + (i % 2) * 370
        fy = feat_y + 30 + (i // 2) * 58
        draw.text((fx, fy), f, fill=(225, 235, 245, 255), font=font_feat)

    # 4. Bottom Call To Action Button
    cta_w, cta_h = 640, 68
    cta_x = (W - cta_w) // 2
    cta_y = 1095
    
    draw.rounded_rectangle([(cta_x, cta_y), (cta_x + cta_w, cta_y + cta_h)], radius=34, fill=(225, 165, 35, 255))
    cta_text = "WATCH THE FULL TRILOGY NOW"
    bbox = draw.textbbox((0, 0), cta_text, font=font_cta)
    tw = bbox[2] - bbox[0]
    draw.text((cta_x + (cta_w - tw) // 2, cta_y + 19), cta_text, fill=(10, 12, 16, 255), font=font_cta)

    footer_text = "Free Streaming on CineWatch  \u2022  No Subscription  \u2022  Link in Bio"
    bbox = draw.textbbox((0, 0), footer_text, font=font_tag)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 1205), footer_text, fill=(155, 175, 200, 255), font=font_tag)

    output_path = 'batman_trilogy_instagram_portrait.png'
    bg.convert('RGB').save(output_path, quality=95)
    print("Generated Portrait:", output_path)

def make_dark_knight_square():
    W, H = 1080, 1080
    bg = Image.new('RGBA', (W, H), (10, 12, 16, 255))

    backdrop_path = 'batman_promo_assets/tdk_backdrop.jpg'
    if os.path.exists(backdrop_path):
        bd = Image.open(backdrop_path).convert('RGBA')
        bd = bd.resize((W, int(W * bd.height / bd.width)))
        if bd.height < H:
            bd = bd.resize((int(H * bd.width / bd.height), H))
        left = (bd.width - W) // 2
        top = (bd.height - H) // 2
        bd = bd.crop((left, top, left + W, top + H))
        dark_overlay = Image.new('RGBA', (W, H), (8, 10, 15, 220))
        bd = Image.alpha_composite(bd, dark_overlay)
        bg = bd

    fog = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fog_draw = ImageDraw.Draw(fog)
    fog_draw.ellipse([W//2 - 400, -80, W//2 + 400, 350], fill=(20, 60, 110, 45))
    fog_draw.ellipse([W//2 - 300, 350, W//2 + 300, 850], fill=(190, 140, 35, 25))
    fog = fog.filter(ImageFilter.GaussianBlur(80))
    bg = Image.alpha_composite(bg, fog)
    draw = ImageDraw.Draw(bg)

    font_brand = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 18)
    font_title = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 38)
    font_sub = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 17)
    font_year = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 16)
    font_movie_title = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 15)
    font_badge = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 13)
    font_cta = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 18)
    font_tag = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 14)

    # 1. Header
    brand_text = "C I N E W A T C H   4 K   E X C L U S I V E"
    bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 38), brand_text, fill=(225, 175, 50, 255), font=font_brand)

    main_title = "THE DARK KNIGHT TRILOGY"
    bbox = draw.textbbox((0, 0), main_title, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 70), main_title, fill=(255, 255, 255, 255), font=font_title)

    sub_text = "CHRISTOPHER NOLAN'S COMPLETE SAGA IN 4K UHD IMAX"
    bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 118), sub_text, fill=(185, 205, 225, 255), font=font_sub)

    # 2. Posters (Square format layout)
    posters_data = [
        ("batman_promo_assets/bb_poster.jpg", "BATMAN BEGINS", "2005", 260, 390, 80, 200),
        ("batman_promo_assets/tdk_poster.jpg", "THE DARK KNIGHT", "2008", 290, 435, (W - 290) // 2, 175),
        ("batman_promo_assets/tdkr_poster.jpg", "THE DARK KNIGHT RISES", "2012", 260, 390, W - 80 - 260, 200)
    ]

    shadows = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadows)
    for p_path, p_title, p_year, pw, ph, px, py in posters_data:
        shadow_draw.rounded_rectangle([(px - 12, py + 12), (px + pw + 12, py + ph + 25)], radius=20, fill=(0, 0, 0, 185))
    shadows = shadows.filter(ImageFilter.GaussianBlur(25))
    bg = Image.alpha_composite(bg, shadows)
    draw = ImageDraw.Draw(bg)

    for idx in [0, 2, 1]:
        p_path, p_title, p_year, pw, ph, px, py = posters_data[idx]
        img = Image.open(p_path).convert('RGBA')
        img = img.resize((pw, ph), Image.Resampling.LANCZOS)

        if idx == 1:
            glow_box = Image.new('RGBA', (pw + 18, ph + 18), (0, 0, 0, 0))
            g_draw = ImageDraw.Draw(glow_box)
            g_draw.rounded_rectangle([(2, 2), (pw + 16, ph + 16)], radius=16, fill=(225, 175, 50, 65))
            glow_box = glow_box.filter(ImageFilter.GaussianBlur(8))
            bg.paste(glow_box, (px - 9, py - 9), glow_box)

        mask = create_rounded_mask((pw, ph), radius=12)
        bg.paste(img, (px, py), mask)

        stroke_color = (225, 175, 50, 240) if idx == 1 else (65, 80, 105, 200)
        border_w = 2 if idx == 1 else 1
        draw.rounded_rectangle([(px, py), (px + pw, py + ph)], radius=12, outline=stroke_color, width=border_w)

        # 4K Badge
        badge_w, badge_h = 50, 22
        bx, by = px + pw - badge_w - 10, py + 10
        draw.rounded_rectangle([(bx, by), (bx + badge_w, by + badge_h)], radius=5, fill=(10, 12, 18, 220), outline=(225, 175, 50, 255), width=1)
        draw.text((bx + 9, by + 3), "4K", fill=(255, 255, 255, 255), font=font_badge)

        # Title & year
        bbox = draw.textbbox((0, 0), p_title, font=font_movie_title)
        tw = bbox[2] - bbox[0]
        text_y = py + ph + 18
        draw.text((px + (pw - tw) // 2, text_y), p_title, fill=(255, 255, 255, 255), font=font_movie_title)

        year_text = f"Part {idx + 1}  \u2022  {p_year}"
        bbox = draw.textbbox((0, 0), year_text, font=font_year)
        tw = bbox[2] - bbox[0]
        draw.text((px + (pw - tw) // 2, text_y + 22), year_text, fill=(225, 175, 50, 255), font=font_year)

    # Features Pill
    pill_w, pill_h = 710, 46
    pill_x = (W - pill_w) // 2
    pill_y = 745
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=23, fill=(16, 22, 32, 220), outline=(48, 68, 98, 255), width=1)
    pill_text = "IMAX Aspect Ratio   \u2022   Dolby 5.1 Surround   \u2022   English & Kurdish Subs"
    bbox = draw.textbbox((0, 0), pill_text, font=font_tag)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, pill_y + 13), pill_text, fill=(220, 235, 250, 255), font=font_tag)

    # CTA Button
    cta_w, cta_h = 540, 58
    cta_x = (W - cta_w) // 2
    cta_y = 835
    draw.rounded_rectangle([(cta_x, cta_y), (cta_x + cta_w, cta_y + cta_h)], radius=29, fill=(225, 165, 35, 255))
    cta_text = "STREAM NOW ON CINEWATCH"
    bbox = draw.textbbox((0, 0), cta_text, font=font_cta)
    tw = bbox[2] - bbox[0]
    draw.text((cta_x + (cta_w - tw) // 2, cta_y + 18), cta_text, fill=(10, 12, 16, 255), font=font_cta)

    footer_text = "Free Streaming  \u2022  Zero Ads  \u2022  Link in Bio"
    bbox = draw.textbbox((0, 0), footer_text, font=font_tag)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 925), footer_text, fill=(150, 170, 195, 255), font=font_tag)

    output_path = 'batman_trilogy_instagram_square.png'
    bg.convert('RGB').save(output_path, quality=95)
    print("Generated Square:", output_path)

def make_dark_knight_reel_story():
    W, H = 1080, 1920
    bg = Image.new('RGBA', (W, H), (10, 12, 16, 255))

    backdrop_path = 'batman_promo_assets/tdk_backdrop.jpg'
    if os.path.exists(backdrop_path):
        bd = Image.open(backdrop_path).convert('RGBA')
        bd = bd.resize((W, int(W * bd.height / bd.width)))
        if bd.height < H:
            bd = bd.resize((int(H * bd.width / bd.height), H))
        left = (bd.width - W) // 2
        top = (bd.height - H) // 2
        bd = bd.crop((left, top, left + W, top + H))
        dark_overlay = Image.new('RGBA', (W, H), (8, 10, 15, 215))
        bd = Image.alpha_composite(bd, dark_overlay)
        bg = bd

    fog = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    fog_draw = ImageDraw.Draw(fog)
    fog_draw.ellipse([W//2 - 450, 0, W//2 + 450, 600], fill=(20, 60, 110, 55))
    fog_draw.ellipse([W//2 - 350, 700, W//2 + 350, 1400], fill=(190, 140, 35, 30))
    fog = fog.filter(ImageFilter.GaussianBlur(100))
    bg = Image.alpha_composite(bg, fog)
    draw = ImageDraw.Draw(bg)

    font_brand = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 24)
    font_title = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 52)
    font_sub = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 24)
    font_year = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 20)
    font_movie_title = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 18)
    font_badge = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 15)
    font_feat = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 20)
    font_cta = ImageFont.truetype('C:\\Windows\\Fonts\\seguibl.ttf', 28)
    font_tag = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 20)

    # 1. Header (Centered, luxury spacing)
    brand_text = "C I N E W A T C H   P R E S E N T S"
    bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 140), brand_text, fill=(225, 175, 50, 255), font=font_brand)

    main_title = "THE DARK KNIGHT"
    bbox = draw.textbbox((0, 0), main_title, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 185), main_title, fill=(255, 255, 255, 255), font=font_title)

    trilogy_text = "T  R  I  L  O  G  Y"
    bbox = draw.textbbox((0, 0), trilogy_text, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 250), trilogy_text, fill=(255, 255, 255, 255), font=font_title)

    sub_text = "CHRISTOPHER NOLAN'S EPIC MASTERPIECE"
    bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 330), sub_text, fill=(185, 205, 230, 255), font=font_sub)

    badge_pill = "4K ULTRA HD   \u2022   IMAX EXPANDED   \u2022   DOLBY 5.1"
    pill_w, pill_h = 580, 44
    pill_x = (W - pill_w) // 2
    pill_y = 380
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=22, fill=(20, 28, 42, 220), outline=(52, 78, 112, 255), width=1)
    bbox = draw.textbbox((0, 0), badge_pill, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, pill_y + 11), badge_pill, fill=(230, 242, 255, 255), font=font_badge)

    # 2. 3D Posters in vertical Reel format
    posters_data = [
        ("batman_promo_assets/bb_poster.jpg", "BATMAN BEGINS", "2005", 300, 450, 50, 580),
        ("batman_promo_assets/tdk_poster.jpg", "THE DARK KNIGHT", "2008", 350, 525, (W - 350) // 2, 540),
        ("batman_promo_assets/tdkr_poster.jpg", "THE DARK KNIGHT RISES", "2012", 300, 450, W - 50 - 300, 580)
    ]

    shadows = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadows)
    for p_path, p_title, p_year, pw, ph, px, py in posters_data:
        shadow_draw.rounded_rectangle([(px - 15, py + 15), (px + pw + 15, py + ph + 35)], radius=28, fill=(0, 0, 0, 190))
    shadows = shadows.filter(ImageFilter.GaussianBlur(35))
    bg = Image.alpha_composite(bg, shadows)
    draw = ImageDraw.Draw(bg)

    for idx in [0, 2, 1]:
        p_path, p_title, p_year, pw, ph, px, py = posters_data[idx]
        img = Image.open(p_path).convert('RGBA')
        img = img.resize((pw, ph), Image.Resampling.LANCZOS)

        if idx == 1:
            glow_box = Image.new('RGBA', (pw + 24, ph + 24), (0, 0, 0, 0))
            g_draw = ImageDraw.Draw(glow_box)
            g_draw.rounded_rectangle([(2, 2), (pw + 22, ph + 22)], radius=20, fill=(225, 175, 50, 70))
            glow_box = glow_box.filter(ImageFilter.GaussianBlur(10))
            bg.paste(glow_box, (px - 12, py - 12), glow_box)

        mask = create_rounded_mask((pw, ph), radius=16)
        bg.paste(img, (px, py), mask)

        stroke_color = (225, 175, 50, 240) if idx == 1 else (65, 80, 105, 200)
        border_w = 3 if idx == 1 else 1
        draw.rounded_rectangle([(px, py), (px + pw, py + ph)], radius=16, outline=stroke_color, width=border_w)

        # 4K Badge
        badge_w, badge_h = 58, 26
        bx, by = px + pw - badge_w - 12, py + 12
        draw.rounded_rectangle([(bx, by), (bx + badge_w, by + badge_h)], radius=6, fill=(10, 12, 18, 220), outline=(225, 175, 50, 255), width=1)
        draw.text((bx + 11, by + 4), "4K", fill=(255, 255, 255, 255), font=font_badge)

        # Title & year
        bbox = draw.textbbox((0, 0), p_title, font=font_movie_title)
        tw = bbox[2] - bbox[0]
        text_y = py + ph + 24
        draw.text((px + (pw - tw) // 2, text_y), p_title, fill=(255, 255, 255, 255), font=font_movie_title)

        year_text = f"Part {idx + 1}  \u2022  {p_year}"
        bbox = draw.textbbox((0, 0), year_text, font=font_year)
        tw = bbox[2] - bbox[0]
        draw.text((px + (pw - tw) // 2, text_y + 28), year_text, fill=(225, 175, 50, 255), font=font_year)

    # 3. Features Card
    feat_y = 1200
    features = [
        "\u2714  All 3 Films in 4K UHD HEVC",
        "\u2714  Full Shifting IMAX Sequences",
        "\u2714  English Dolby 5.1 Surround",
        "\u2714  English & Kurdish Subtitles"
    ]
    box_w, box_h = 840, 200
    box_x = (W - box_w) // 2
    draw.rounded_rectangle([(box_x, feat_y), (box_x + box_w, feat_y + box_h)], radius=20, fill=(16, 22, 32, 220), outline=(48, 68, 98, 255), width=1)
    for i, f in enumerate(features):
        fx = box_x + 45 + (i % 2) * 410
        fy = feat_y + 35 + (i // 2) * 75
        draw.text((fx, fy), f, fill=(225, 235, 245, 255), font=font_feat)

    # 4. CTA
    cta_w, cta_h = 720, 80
    cta_x = (W - cta_w) // 2
    cta_y = 1520
    draw.rounded_rectangle([(cta_x, cta_y), (cta_x + cta_w, cta_y + cta_h)], radius=40, fill=(225, 165, 35, 255))
    cta_text = "STREAM NOW FOR FREE"
    bbox = draw.textbbox((0, 0), cta_text, font=font_cta)
    tw = bbox[2] - bbox[0]
    draw.text((cta_x + (cta_w - tw) // 2, cta_y + 22), cta_text, fill=(10, 12, 16, 255), font=font_cta)

    footer_text = "Available On All Devices  \u2022  Link In Bio"
    bbox = draw.textbbox((0, 0), footer_text, font=font_tag)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, 1630), footer_text, fill=(160, 180, 205, 255), font=font_tag)

    output_path = 'batman_trilogy_instagram_reel_story.png'
    bg.convert('RGB').save(output_path, quality=95)
    print("Generated Reel/Story Poster:", output_path)

if __name__ == '__main__':
    make_dark_knight_portrait()
    make_dark_knight_square()
    make_dark_knight_reel_story()
