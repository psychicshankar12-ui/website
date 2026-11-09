import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 800, 800

def get_font(size, bold=False):
    path = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf' if bold else '/System/Library/Fonts/Supplemental/Georgia.ttf'
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia.ttf', size)

def draw_star(draw, cx, cy, r_outer, r_inner, points, fill, outline=None):
    angle = math.pi / points
    pts = []
    for i in range(2 * points):
        r = r_outer if i % 2 == 0 else r_inner
        a = i * angle - math.pi / 2
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    draw.polygon(pts, fill=fill, outline=outline)

def draw_heart(draw, cx, cy, size, fill, outline=None, width=1):
    # Parametric heart
    pts = []
    for t_deg in range(0, 360, 5):
        t = math.radians(t_deg)
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        scale = size / 32.0
        pts.append((cx + x * scale, cy + y * scale))
    draw.polygon(pts, fill=fill, outline=outline)

def draw_glow(img, cx, cy, radius, color):
    # Draws a soft blurred glow on an overlay
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for r in range(radius, 0, -8):
        alpha = int(color[3] * (1.0 - (r / radius) ** 1.5))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(color[0], color[1], color[2], alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(16))
    img.alpha_composite(overlay)

def create_card_base(seed=42):
    img = Image.new('RGBA', (W, H), (8, 6, 22, 255))
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, H // 2 - 20
    
    # 1. Background radial gradient
    max_r = int(math.sqrt(cx**2 + cy**2))
    for r in range(max_r, 0, -6):
        f = (r / max_r) ** 1.3
        red = int(48 * (1 - f) + 7 * f)
        green = int(18 * (1 - f) + 5 * f)
        blue = int(80 * (1 - f) + 18 * f)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue, 255))
    
    # 2. Celestial starfield
    rng = random.Random(seed)
    for _ in range(110):
        sx = rng.randint(30, W - 30)
        sy = rng.randint(30, H - 30)
        s_rad = rng.choice([1, 1, 2, 2, 3])
        alpha = rng.randint(120, 240)
        draw.ellipse([sx - s_rad, sy - s_rad, sx + s_rad, sy + s_rad], fill=(255, 235, 190, alpha))
        if s_rad == 3 and rng.random() > 0.6:
            draw.line([sx - 5, sy, sx + 5, sy], fill=(255, 255, 220, alpha), width=1)
            draw.line([sx, sy - 5, sx, sy + 5], fill=(255, 255, 220, alpha), width=1)
            
    # 3. Sacred mandala rings in center
    my = cy
    for r in [280, 260, 240, 200, 160]:
        draw.ellipse([cx - r, my - r, cx + r, my + r], outline=(212, 175, 55, 50), width=2)
    
    # Sacred degree ticks
    for i in range(36):
        ang = i * (2 * math.pi / 36)
        x1 = cx + 240 * math.cos(ang)
        y1 = my + 240 * math.sin(ang)
        x2 = cx + 260 * math.cos(ang)
        y2 = my + 260 * math.sin(ang)
        draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 80), width=2)
        
    # 4. Golden frame & border
    pad = 26
    draw.rectangle([pad, pad, W - pad, H - pad], outline=(212, 175, 55, 230), width=4)
    draw.rectangle([pad + 7, pad + 7, W - pad - 7, H - pad - 7], outline=(255, 235, 120, 110), width=2)
    
    # Corner flourishes
    corn_size = 40
    for ox, oy in [(pad, pad), (W - pad, pad), (pad, H - pad), (W - pad, H - pad)]:
        dx = 1 if ox == pad else -1
        dy = 1 if oy == pad else -1
        draw.line([ox, oy, ox + dx * corn_size, oy], fill=(255, 215, 0, 240), width=3)
        draw.line([ox, oy, ox, oy + dy * corn_size], fill=(255, 215, 0, 240), width=3)
        draw.ellipse([ox + dx * 14 - 4, oy + dy * 14 - 4, ox + dx * 14 + 4, oy + dy * 14 + 4], fill=(255, 215, 0, 255))
        
    return img

def add_title_ribbon(img, title):
    draw = ImageDraw.Draw(img)
    # Bottom ribbon banner
    rw, rh = 720, 110
    rx = (W - rw) // 2
    ry = H - rh - 42
    
    # Shadow
    draw.rounded_rectangle([rx + 4, ry + 4, rx + rw + 4, ry + rh + 4], radius=20, fill=(0, 0, 0, 160))
    # Fill
    draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=20, fill=(18, 12, 38, 245), outline=(212, 175, 55, 240), width=3)
    draw.rounded_rectangle([rx + 4, ry + 4, rx + rw - 4, ry + rh - 4], radius=16, outline=(255, 230, 130, 90), width=1)
    
    # Brand subtitle
    f_sub = get_font(18, bold=True)
    brand_txt = "✦ PSYCHIC SHANKAR ✦"
    sub_bbox = f_sub.getbbox(brand_txt)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((W - sub_w) // 2, ry + 16), brand_txt, fill=(255, 215, 0, 255), font=f_sub)
    
    # Title
    f_title = get_font(30, bold=True)
    title_upper = title.upper()
    t_bbox = f_title.getbbox(title_upper)
    t_w = t_bbox[2] - t_bbox[0]
    if t_w > rw - 40:
        f_title = get_font(24, bold=True)
        t_bbox = f_title.getbbox(title_upper)
        t_w = t_bbox[2] - t_bbox[0]
        
    draw.text(((W - t_w) // 2, ry + 52), title_upper, fill=(255, 255, 255, 255), font=f_title)

SERVICES = [
    (1, "Get your Ex Love Back", "love_back"),
    (2, "Love Relationship Problem", "love_problem"),
    (3, "Black Magic Specialist", "black_magic"),
    (4, "Spiritual Healing", "spiritual_healing"),
    (5, "Psychic Reading", "psychic_reading"),
    (6, "Husband and Wife Dispute", "husband_wife"),
    (7, "Negative Energy Removal", "negative_energy"),
    (8, "Evil Spirit Removal", "evil_spirit"),
    (9, "Powerful Love Spells", "love_spells"),
    (10, "Partner in Your Control", "partner_control"),
    (11, "Stop Cheating Partner", "stop_cheating"),
    (12, "Stop Separation / Divorce", "stop_divorce"),
    (13, "Jealousy and Curse Removal", "curse_removal"),
    (14, "Bad Luck Removal", "bad_luck"),
    (15, "Childless Couples", "childless_couples"),
    (16, "Financial / Business Problem", "financial_business"),
    (17, "Health Issues Problem", "health_issues"),
    (18, "Voodoo Spell Caster", "voodoo_caster"),
    (19, "Removing Witchcraft", "removing_witchcraft"),
    (20, "Enemy Problem Solutions", "enemy_solutions"),
]

def draw_motif(img, motif_type):
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, H // 2 - 35
    
    if motif_type == "love_back":
        # Intertwined twin hearts with gold infinity knot and ascending embers
        draw_glow(img, cx, cy, 220, (230, 40, 80, 160))
        draw_glow(img, cx, cy, 140, (255, 215, 0, 180))
        # Left heart (crimson)
        draw_heart(draw, cx - 75, cy - 10, 170, fill=(200, 20, 60, 220), outline=(255, 215, 0, 255), width=4)
        # Right heart (rose gold)
        draw_heart(draw, cx + 75, cy - 10, 170, fill=(220, 50, 90, 220), outline=(255, 215, 0, 255), width=4)
        # Center golden infinity knot
        for a in range(0, 360, 4):
            t = math.radians(a)
            # Lemniscate of Bernoulli
            scale = 130
            denom = 1 + (math.sin(t) ** 2)
            x = cx + scale * math.cos(t) / denom
            y = cy + scale * math.sin(t) * math.cos(t) / denom
            draw.ellipse([x - 7, y - 7, x + 7, y + 7], fill=(255, 225, 80, 255))
        # Center star
        draw_star(draw, cx, cy, 32, 12, 8, fill=(255, 255, 220, 255), outline=(212, 175, 55, 255))

    elif motif_type == "love_problem":
        # Two joined wedding rings with radiant pink lotus & crescent moon
        draw_glow(img, cx, cy, 230, (220, 60, 140, 150))
        draw_glow(img, cx, cy - 50, 140, (255, 215, 0, 170))
        # Crescent Moon
        draw.ellipse([cx - 80, cy - 180, cx + 80, cy - 20], fill=(255, 235, 170, 240))
        draw.ellipse([cx - 50, cy - 190, cx + 100, cy - 10], fill=(28, 16, 54, 255))
        # Twin Golden Rings
        r_rad = 90
        # Ring 1
        draw.ellipse([cx - 110 - r_rad, cy + 10 - r_rad, cx - 110 + r_rad, cy + 10 + r_rad], outline=(255, 215, 0, 255), width=14)
        draw.ellipse([cx - 110 - r_rad + 4, cy + 10 - r_rad + 4, cx - 110 + r_rad - 4, cy + 10 + r_rad - 4], outline=(255, 245, 180, 180), width=4)
        # Ring 2
        draw.ellipse([cx + 20 - r_rad, cy + 10 - r_rad, cx + 20 + r_rad, cy + 10 + r_rad], outline=(255, 215, 0, 255), width=14)
        draw.ellipse([cx + 20 - r_rad + 4, cy + 10 - r_rad + 4, cx + 20 + r_rad - 4, cy + 10 + r_rad - 4], outline=(255, 245, 180, 180), width=4)
        # Diamond sparkles
        draw_star(draw, cx - 45, cy + 10, 28, 10, 6, fill=(255, 255, 255, 255))
        # Lotus petals below
        for i in range(-3, 4):
            ang = math.radians(i * 15)
            lx = cx + 80 * math.sin(ang)
            ly = cy + 110 + 20 * abs(i)
            draw.ellipse([lx - 25, ly - 50, lx + 25, ly + 50], fill=(255, 130, 180, 180), outline=(255, 215, 0, 200), width=2)

    elif motif_type == "black_magic":
        # Sacred Golden Trishul (Trident) breaking dark chains with radiant solar shield
        draw_glow(img, cx, cy, 240, (255, 180, 0, 160))
        draw_glow(img, cx, cy - 30, 150, (255, 240, 120, 190))
        # Radiating Solar Rays
        for i in range(24):
            ang = i * (2 * math.pi / 24)
            x1 = cx + 110 * math.cos(ang)
            y1 = cy - 30 + 110 * math.sin(ang)
            x2 = cx + 210 * math.cos(ang)
            y2 = cy - 30 + 210 * math.sin(ang)
            draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 120), width=4)
        # Trishul center spear
        draw.rectangle([cx - 8, cy - 140, cx + 8, cy + 140], fill=(255, 215, 0, 255), outline=(212, 175, 55, 255))
        draw.polygon([(cx, cy - 190), (cx - 24, cy - 130), (cx + 24, cy - 130)], fill=(255, 235, 120, 255))
        # Trishul side curved prongs
        draw.arc([cx - 100, cy - 150, cx, cy - 40], start=90, end=270, fill=(255, 215, 0, 255), width=14)
        draw.polygon([(cx - 100, cy - 145), (cx - 115, cy - 100), (cx - 85, cy - 100)], fill=(255, 235, 120, 255))
        draw.arc([cx, cy - 150, cx + 100, cy - 40], start=270, end=90, fill=(255, 215, 0, 255), width=14)
        draw.polygon([(cx + 100, cy - 145), (cx + 85, cy - 100), (cx + 115, cy - 100)], fill=(255, 235, 120, 255))
        # Damaru drum in middle
        draw.polygon([(cx - 30, cy - 30), (cx + 30, cy - 30), (cx, cy), (cx - 30, cy + 30), (cx + 30, cy + 30)], fill=(212, 175, 55, 255), outline=(255, 240, 160, 255), width=2)

    elif motif_type == "spiritual_healing":
        # Meditating yogi with 7 vibrant chakra spheres glowing
        draw_glow(img, cx, cy, 230, (80, 200, 220, 160))
        draw_glow(img, cx, cy, 140, (255, 255, 255, 180))
        # Meditating silhouette
        # Head
        draw.ellipse([cx - 40, cy - 160, cx + 40, cy - 80], fill=(22, 14, 46, 255), outline=(255, 215, 0, 200), width=3)
        # Torso & Shoulders
        draw.polygon([(cx, cy - 80), (cx - 90, cy + 10), (cx - 60, cy + 80), (cx + 60, cy + 80), (cx + 90, cy + 10)], fill=(22, 14, 46, 255), outline=(255, 215, 0, 200), width=3)
        # Crossed legs
        draw.ellipse([cx - 130, cy + 50, cx + 130, cy + 120], fill=(22, 14, 46, 255), outline=(255, 215, 0, 200), width=3)
        # 7 Chakras
        chakras = [
            (cy - 120, (180, 80, 255)),  # Sahasrara - Violet
            (cy - 85, (90, 80, 255)),    # Ajna - Indigo
            (cy - 50, (60, 180, 255)),   # Vishuddha - Cyan
            (cy - 15, (60, 220, 100)),   # Anahata - Emerald
            (cy + 20, (255, 220, 40)),   # Manipura - Yellow
            (cy + 55, (255, 140, 40)),   # Svadhisthana - Orange
            (cy + 90, (230, 40, 50)),    # Muladhara - Red
        ]
        for c_y, c_col in chakras:
            draw_glow(img, cx, c_y, 45, (*c_col, 200))
            draw.ellipse([cx - 14, c_y - 14, cx + 14, c_y + 14], fill=(*c_col, 255), outline=(255, 255, 255, 255), width=2)
            draw_star(draw, cx, c_y, 10, 4, 4, fill=(255, 255, 255, 255))

    elif motif_type == "psychic_reading":
        # Glowing celestial crystal ball on golden ornate tripod with swirling galaxy
        draw_glow(img, cx, cy - 20, 220, (140, 80, 240, 160))
        draw_glow(img, cx, cy - 20, 140, (180, 220, 255, 200))
        # Crystal sphere
        cb_r = 120
        draw.ellipse([cx - cb_r, cy - 20 - cb_r, cx + cb_r, cy - 20 + cb_r], fill=(35, 25, 75, 240), outline=(212, 175, 55, 255), width=5)
        # Galaxy swirl inside
        for a in range(0, 720, 8):
            t = math.radians(a)
            r = (a / 720.0) * (cb_r - 20)
            gx = cx + r * math.cos(t)
            gy = cy - 20 + r * math.sin(t)
            draw.ellipse([gx - 3, gy - 3, gx + 3, gy + 3], fill=(255, 235, 170, 220))
        # Third eye atop sphere
        draw_star(draw, cx, cy - 20, 40, 15, 8, fill=(255, 255, 255, 255), outline=(255, 215, 0, 255))
        # Golden Tripod Stand
        draw.arc([cx - 100, cy + 60, cx + 100, cy + 130], start=0, end=180, fill=(255, 215, 0, 255), width=10)
        draw.line([cx - 80, cy + 95, cx - 110, cy + 155], fill=(255, 215, 0, 255), width=12)
        draw.line([cx + 80, cy + 95, cx + 110, cy + 155], fill=(255, 215, 0, 255), width=12)
        draw.line([cx, cy + 95, cx, cy + 155], fill=(255, 215, 0, 255), width=12)

    elif motif_type == "husband_wife":
        # Sacred Vedic Agni fire with two joined golden hands and mangalsutra knot
        draw_glow(img, cx, cy, 230, (255, 140, 40, 160))
        draw_glow(img, cx, cy - 40, 140, (255, 230, 80, 190))
        # Sacred Agni Fire Altar
        draw.polygon([(cx - 140, cy + 110), (cx + 140, cy + 110), (cx + 110, cy + 145), (cx - 110, cy + 145)], fill=(180, 100, 30, 255), outline=(255, 215, 0, 255), width=3)
        draw.polygon([(cx - 110, cy + 85), (cx + 110, cy + 85), (cx + 90, cy + 110), (cx - 90, cy + 110)], fill=(210, 130, 40, 255), outline=(255, 215, 0, 255), width=3)
        # Rising Holy Fire Flames
        flame_pts = [
            (cx, cy - 130), (cx + 35, cy - 50), (cx + 80, cy - 70), (cx + 50, cy + 10),
            (cx + 90, cy + 70), (cx - 90, cy + 70), (cx - 50, cy + 10), (cx - 80, cy - 70), (cx - 35, cy - 50)
        ]
        draw.polygon(flame_pts, fill=(255, 90, 20, 230), outline=(255, 220, 50, 255), width=3)
        # Inner Golden Flame
        inner_flame = [
            (cx, cy - 90), (cx + 20, cy - 30), (cx + 40, cy + 30), (cx - 40, cy + 30), (cx - 20, cy - 30)
        ]
        draw.polygon(inner_flame, fill=(255, 240, 80, 255))
        # Intertwined Wedding Mangalsutra Beads Arching
        for a in range(0, 180, 12):
            t = math.radians(a)
            bx = cx + 150 * math.cos(t)
            by = cy - 30 - 100 * math.sin(t)
            draw.ellipse([bx - 8, by - 8, bx + 8, by + 8], fill=(255, 215, 0, 255), outline=(0, 0, 0, 200), width=2)
            if a % 24 == 0:
                draw.ellipse([bx - 5, by - 5, bx + 5, by + 5], fill=(220, 30, 50, 255))

    elif motif_type == "negative_energy":
        # Sacred golden purification bell with soundwaves dissolving dark clouds into starlight
        draw_glow(img, cx, cy - 20, 230, (255, 215, 0, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 255, 200, 200))
        # Soundwave rings
        for r in [170, 195, 220]:
            draw.arc([cx - r, cy - 20 - r, cx + r, cy - 20 + r], start=30, end=150, fill=(255, 215, 0, 120), width=4)
            draw.arc([cx - r, cy - 20 - r, cx + r, cy - 20 + r], start=210, end=330, fill=(255, 215, 0, 120), width=4)
        # Bell handle
        draw.rectangle([cx - 10, cy - 140, cx + 10, cy - 60], fill=(212, 175, 55, 255), outline=(255, 235, 140, 255), width=2)
        draw_star(draw, cx, cy - 150, 24, 10, 6, fill=(255, 215, 0, 255))
        # Bell dome
        draw.chord([cx - 90, cy - 90, cx + 90, cy + 50], start=0, end=180, fill=(255, 215, 0, 255), outline=(212, 175, 55, 255), width=4)
        draw.rectangle([cx - 100, cy + 45, cx + 100, cy + 65], fill=(255, 235, 120, 255), outline=(212, 175, 55, 255), width=3)
        # Clapper
        draw.ellipse([cx - 20, cy + 65, cx + 20, cy + 105], fill=(212, 175, 55, 255))
        # Divine Om glow in center of bell
        f_om = get_font(42, bold=True)
        draw.text((cx - 22, cy - 35), "ॐ", fill=(120, 40, 10, 255), font=f_om)

    elif motif_type == "evil_spirit":
        # Sacred Vedic Havan Kund fire pit with Sanskrit Om shield & protective ring of fire
        draw_glow(img, cx, cy, 230, (255, 70, 20, 170))
        draw_glow(img, cx, cy - 30, 140, (255, 210, 50, 200))
        # Ring of protective fire runes
        for i in range(16):
            ang = i * (2 * math.pi / 16)
            rx = cx + 210 * math.cos(ang)
            ry = cy - 20 + 210 * math.sin(ang)
            draw_star(draw, rx, ry, 16, 6, 4, fill=(255, 215, 0, 220))
        # Shield Circle
        draw.ellipse([cx - 140, cy - 160, cx + 140, cy + 120], fill=(40, 16, 20, 230), outline=(255, 215, 0, 255), width=6)
        # Blazing Fire
        draw.polygon([(cx, cy - 120), (cx + 50, cy - 30), (cx + 80, cy + 40), (cx - 80, cy + 40), (cx - 50, cy - 30)], fill=(255, 120, 20, 240), outline=(255, 240, 80, 255), width=3)
        draw.polygon([(cx, cy - 80), (cx + 25, cy - 10), (cx + 40, cy + 30), (cx - 40, cy + 30), (cx - 25, cy - 10)], fill=(255, 245, 100, 255))
        # Sacred Om Emblem in Shield
        f_om = get_font(60, bold=True)
        draw.text((cx - 30, cy - 40), "ॐ", fill=(255, 255, 255, 255), font=f_om)

    elif motif_type == "love_spells":
        # Twin ritual candles burning with golden-red flames, heart embers & Venus glyph
        draw_glow(img, cx, cy, 220, (240, 40, 100, 160))
        draw_glow(img, cx, cy - 40, 130, (255, 220, 80, 190))
        # Candle 1 (left)
        draw.rectangle([cx - 90, cy - 30, cx - 35, cy + 120], fill=(200, 20, 60, 255), outline=(255, 215, 0, 255), width=3)
        draw.ellipse([cx - 70, cy - 65, cx - 55, cy - 35], fill=(255, 220, 50, 255))
        draw_heart(draw, cx - 62, cy - 90, 45, fill=(255, 240, 100, 255), outline=(255, 100, 50, 255), width=2)
        # Candle 2 (right)
        draw.rectangle([cx + 35, cy - 50, cx + 90, cy + 120], fill=(220, 40, 80, 255), outline=(255, 215, 0, 255), width=3)
        draw.ellipse([cx + 55, cy - 85, cx + 70, cy - 55], fill=(255, 220, 50, 255))
        draw_heart(draw, cx + 62, cy - 110, 45, fill=(255, 240, 100, 255), outline=(255, 100, 50, 255), width=2)
        # Venus Glyph ♀ in center
        draw.ellipse([cx - 35, cy - 50, cx + 35, cy + 20], outline=(255, 215, 0, 255), width=8)
        draw.line([cx, cy + 20, cx, cy + 90], fill=(255, 215, 0, 255), width=8)
        draw.line([cx - 25, cy + 55, cx + 25, cy + 55], fill=(255, 215, 0, 255), width=8)

    elif motif_type == "partner_control":
        # Sacred Vashikaran Yantra with radiating hypnotic attraction rings
        draw_glow(img, cx, cy - 20, 230, (220, 40, 120, 160))
        draw_glow(img, cx, cy - 20, 140, (255, 215, 0, 200))
        # Concentric magnetic attraction rings
        for r in [60, 100, 140, 180, 220]:
            draw.ellipse([cx - r, cy - 20 - r, cx + r, cy - 20 + r], outline=(255, 215, 0, 120), width=3)
        # Shri Yantra Interlocked Triangles
        # Triangle 1 (upward)
        draw.polygon([(cx, cy - 130), (cx - 95, cy + 35), (cx + 95, cy + 35)], outline=(255, 235, 120, 255), width=4)
        # Triangle 2 (downward)
        draw.polygon([(cx, cy + 90), (cx - 95, cy - 75), (cx + 95, cy - 75)], outline=(255, 215, 0, 255), width=4)
        # Triangle 3 (inner upward)
        draw.polygon([(cx, cy - 90), (cx - 60, cy + 20), (cx + 60, cy + 20)], outline=(255, 160, 50, 255), width=3)
        # Center Bindu of magnetic attraction
        draw_heart(draw, cx, cy - 20, 60, fill=(230, 20, 60, 255), outline=(255, 255, 255, 255), width=3)
        draw_star(draw, cx, cy - 20, 20, 8, 8, fill=(255, 255, 255, 255))

    elif motif_type == "stop_cheating":
        # Sacred golden padlock binding two rings with an unbreakable vow, fidelity laurels
        draw_glow(img, cx, cy - 20, 220, (255, 200, 50, 170))
        draw_glow(img, cx, cy - 20, 130, (255, 240, 180, 200))
        # Shackle
        draw.arc([cx - 70, cy - 150, cx + 70, cy - 10], start=180, end=360, fill=(255, 215, 0, 255), width=20)
        # Padlock Body
        draw.rounded_rectangle([cx - 95, cy - 40, cx + 95, cy + 120], radius=18, fill=(212, 175, 55, 255), outline=(255, 240, 150, 255), width=5)
        # Keyhole
        draw.ellipse([cx - 18, cy + 5, cx + 18, cy + 41], fill=(20, 10, 35, 255))
        draw.polygon([(cx - 12, cy + 28), (cx + 12, cy + 28), (cx + 18, cy + 85), (cx - 18, cy + 85)], fill=(20, 10, 35, 255))
        # Fidelity heart badge on padlock
        draw_heart(draw, cx, cy - 10, 40, fill=(220, 20, 60, 255), outline=(255, 255, 255, 255), width=2)
        # Two joined rings hanging from base
        draw.ellipse([cx - 65, cy + 90, cx - 15, cy + 140], outline=(255, 215, 0, 255), width=8)
        draw.ellipse([cx + 15, cy + 90, cx + 65, cy + 140], outline=(255, 215, 0, 255), width=8)

    elif motif_type == "stop_divorce":
        # Two wedding rings reconnecting in a burst of divine golden light
        draw_glow(img, cx, cy - 20, 230, (255, 180, 50, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 255, 255, 210))
        # Big Golden Reunion Starburst
        draw_star(draw, cx, cy - 20, 160, 50, 12, fill=(255, 220, 80, 130))
        draw_star(draw, cx, cy - 20, 100, 30, 8, fill=(255, 245, 180, 200))
        # Ring Left
        draw.ellipse([cx - 130, cy - 85, cx + 10, cy + 45], outline=(255, 215, 0, 255), width=16)
        draw.ellipse([cx - 124, cy - 79, cx + 4, cy + 39], outline=(255, 250, 200, 200), width=4)
        # Ring Right
        draw.ellipse([cx - 10, cy - 85, cx + 130, cy + 45], outline=(255, 215, 0, 255), width=16)
        draw.ellipse([cx - 4, cy - 79, cx + 124, cy + 39], outline=(255, 250, 200, 200), width=4)
        # Divine reconciliation heart
        draw_heart(draw, cx, cy - 20, 75, fill=(230, 30, 70, 255), outline=(255, 255, 255, 255), width=3)
        draw_star(draw, cx, cy - 20, 24, 8, 6, fill=(255, 255, 255, 255))
        # Olive blessing branches
        for i in range(-4, 5):
            ox = cx + i * 30
            oy = cy + 90 - abs(i) * 6
            draw.ellipse([ox - 10, oy - 6, ox + 10, oy + 6], fill=(100, 200, 100, 220), outline=(255, 215, 0, 200), width=2)

    elif motif_type == "curse_removal":
        # Ornate Nazar evil eye amulet with deflecting mirror shield
        draw_glow(img, cx, cy - 20, 230, (40, 120, 240, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 215, 0, 180))
        # Concentric Nazar Eye
        draw.ellipse([cx - 160, cy - 20 - 160, cx + 160, cy - 20 + 160], fill=(212, 175, 55, 255))
        draw.ellipse([cx - 148, cy - 20 - 148, cx + 148, cy - 20 + 148], fill=(16, 44, 115, 255))   # Dark Blue
        draw.ellipse([cx - 105, cy - 20 - 105, cx + 105, cy - 20 + 105], fill=(245, 245, 250, 255)) # White
        draw.ellipse([cx - 70, cy - 20 - 70, cx + 70, cy - 20 + 70], fill=(42, 175, 220, 255))    # Turquoise
        draw.ellipse([cx - 35, cy - 20 - 35, cx + 35, cy - 20 + 35], fill=(10, 10, 25, 255))       # Pupil
        draw_star(draw, cx + 8, cy - 28, 16, 6, 6, fill=(255, 255, 255, 255))                     # Sparkle
        # Deflection Rays
        for a in [45, 135, 225, 315]:
            rad = math.radians(a)
            x1 = cx + 175 * math.cos(rad)
            y1 = cy - 20 + 175 * math.sin(rad)
            x2 = cx + 225 * math.cos(rad)
            y2 = cy - 20 + 225 * math.sin(rad)
            draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 240), width=5)

    elif motif_type == "bad_luck":
        # Golden celestial horseshoe pointing upwards with 4-leaf star clover & lucky sun
        draw_glow(img, cx, cy - 20, 230, (255, 215, 0, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 245, 180, 200))
        # Radiant Sun of Destiny
        for i in range(16):
            ang = i * (2 * math.pi / 16)
            x1 = cx + 70 * math.cos(ang)
            y1 = cy - 20 + 70 * math.sin(ang)
            x2 = cx + 180 * math.cos(ang)
            y2 = cy - 20 + 180 * math.sin(ang)
            draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 140), width=4)
        # Large Golden Horseshoe
        # Outer arc
        draw.arc([cx - 110, cy - 120, cx + 110, cy + 100], start=0, end=180, fill=(255, 215, 0, 255), width=32)
        draw.line([cx - 94, cy - 110, cx - 94, cy - 20], fill=(255, 215, 0, 255), width=32)
        draw.line([cx + 94, cy - 110, cx + 94, cy - 20], fill=(255, 215, 0, 255), width=32)
        # Nail holes in horseshoe
        for hx, hy in [(-94, -90), (-94, -40), (-75, 40), (-40, 75), (40, 75), (75, 40), (94, -40), (94, -90)]:
            draw.ellipse([cx + hx - 5, cy + hy - 5, cx + hx + 5, cy + hy + 5], fill=(30, 20, 50, 255))
        # 4-Leaf Lucky Clover in Center
        for a in [0, 90, 180, 270]:
            rad = math.radians(a)
            lx = cx + 24 * math.cos(rad)
            ly = cy - 20 + 24 * math.sin(rad)
            draw_heart(draw, lx, ly, 38, fill=(40, 180, 80, 255), outline=(255, 215, 0, 255), width=2)
        draw_star(draw, cx, cy - 20, 14, 5, 4, fill=(255, 255, 255, 255))

    elif motif_type == "childless_couples":
        # Santan Gopal golden cradle swing with celestial blooming lotus
        draw_glow(img, cx, cy - 20, 230, (255, 180, 220, 160))
        draw_glow(img, cx, cy - 20, 140, (255, 220, 100, 190))
        # Cradle ropes
        draw.line([cx - 80, cy - 140, cx - 60, cy - 10], fill=(255, 215, 0, 255), width=5)
        draw.line([cx + 80, cy - 140, cx + 60, cy - 10], fill=(255, 215, 0, 255), width=5)
        # Cradle basket
        draw.chord([cx - 110, cy - 60, cx + 110, cy + 70], start=0, end=180, fill=(212, 175, 55, 255), outline=(255, 240, 160, 255), width=4)
        # Sleeping baby halo inside
        draw.ellipse([cx - 30, cy - 15, cx + 30, cy + 45], fill=(255, 240, 200, 255))
        draw.ellipse([cx - 15, cy - 5, cx + 15, cy + 25], fill=(255, 215, 0, 255))
        # Blooming Lotus below
        for i in range(-4, 5):
            ang = math.radians(i * 15)
            lx = cx + 90 * math.sin(ang)
            ly = cy + 90 + 15 * abs(i)
            draw.ellipse([lx - 25, ly - 40, lx + 25, ly + 40], fill=(255, 140, 190, 200), outline=(255, 215, 0, 200), width=2)
        draw_star(draw, cx, cy - 140, 28, 10, 8, fill=(255, 255, 255, 255))

    elif motif_type == "financial_business":
        # Golden Kalash pot of wealth overflowing with coins, Shri Yantra & Lakshmi lotus
        draw_glow(img, cx, cy - 20, 240, (255, 215, 0, 180))
        draw_glow(img, cx, cy - 20, 140, (255, 250, 180, 210))
        # Kalash Pot
        draw.ellipse([cx - 90, cy - 10, cx + 90, cy + 120], fill=(212, 175, 55, 255), outline=(255, 245, 160, 255), width=5)
        # Pot Neck & Rim
        draw.rectangle([cx - 50, cy - 40, cx + 50, cy - 10], fill=(255, 215, 0, 255), outline=(212, 175, 55, 255), width=3)
        draw.ellipse([cx - 65, cy - 55, cx + 65, cy - 35], fill=(255, 235, 130, 255), outline=(212, 175, 55, 255), width=3)
        # Coconut on top
        draw.ellipse([cx - 40, cy - 110, cx + 40, cy - 45], fill=(160, 90, 30, 255), outline=(255, 215, 0, 255), width=3)
        # Mango Leaves
        draw.polygon([(cx - 70, cy - 40), (cx - 100, cy - 90), (cx - 45, cy - 70)], fill=(40, 160, 60, 255))
        draw.polygon([(cx + 70, cy - 40), (cx + 100, cy - 90), (cx + 45, cy - 70)], fill=(40, 160, 60, 255))
        # Overflowing Gold Coins
        coin_coords = [(-60, -10), (-30, -25), (0, -35), (30, -25), (60, -10), (-45, 10), (0, 0), (45, 10), (-85, 45), (85, 45), (-100, 80), (100, 80)]
        for kx, ky in coin_coords:
            draw.ellipse([cx + kx - 18, cy + ky - 18, cx + kx + 18, cy + ky + 18], fill=(255, 215, 0, 255), outline=(180, 130, 20, 255), width=3)
            draw.ellipse([cx + kx - 12, cy + ky - 12, cx + kx + 12, cy + ky + 12], outline=(255, 245, 180, 255), width=1)
        # Swastik / Wealth symbol on pot
        f_sym = get_font(40, bold=True)
        draw.text((cx - 20, cy + 30), "卐", fill=(180, 30, 30, 255), font=f_sym)

    elif motif_type == "health_issues":
        # Sacred Amrita nectar vessel / Dhanvantari healing pot with emerald prana rays
        draw_glow(img, cx, cy - 20, 230, (40, 200, 120, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 255, 200, 200))
        # Healing Mandala rays
        for i in range(16):
            ang = i * (2 * math.pi / 16)
            x1 = cx + 80 * math.cos(ang)
            y1 = cy - 20 + 80 * math.sin(ang)
            x2 = cx + 180 * math.cos(ang)
            y2 = cy - 20 + 180 * math.sin(ang)
            draw.line([x1, y1, x2, y2], fill=(60, 220, 140, 130), width=4)
        # Amrita Pot (Gold & Jade)
        draw.ellipse([cx - 80, cy - 30, cx + 80, cy + 100], fill=(30, 140, 80, 255), outline=(255, 215, 0, 255), width=5)
        draw.rectangle([cx - 40, cy - 65, cx + 40, cy - 30], fill=(255, 215, 0, 255), outline=(212, 175, 55, 255), width=3)
        draw.ellipse([cx - 55, cy - 80, cx + 55, cy - 60], fill=(255, 235, 130, 255), outline=(212, 175, 55, 255), width=3)
        # Healing Lotus / Herb Sprouting
        draw.ellipse([cx - 20, cy - 130, cx + 20, cy - 80], fill=(60, 230, 120, 255), outline=(255, 255, 255, 255), width=2)
        draw.ellipse([cx - 50, cy - 110, cx - 10, cy - 70], fill=(40, 190, 90, 255), outline=(255, 215, 0, 255), width=2)
        draw.ellipse([cx + 10, cy - 110, cx + 50, cy - 70], fill=(40, 190, 90, 255), outline=(255, 215, 0, 255), width=2)
        # Red Cross / Sacred Heart of Vitality
        draw.rectangle([cx - 10, cy + 10, cx + 10, cy + 60], fill=(255, 255, 255, 255))
        draw.rectangle([cx - 25, cy + 25, cx + 25, cy + 45], fill=(255, 255, 255, 255))

    elif motif_type == "voodoo_caster":
        # White magic protective pentacle with ritual herbs, crystals & purifying candle
        draw_glow(img, cx, cy - 20, 230, (160, 80, 230, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 215, 0, 190))
        # Protective circle
        draw.ellipse([cx - 160, cy - 20 - 160, cx + 160, cy - 20 + 160], outline=(255, 215, 0, 255), width=6)
        draw.ellipse([cx - 142, cy - 20 - 142, cx + 142, cy - 20 + 142], outline=(255, 235, 140, 140), width=2)
        # Five-pointed white magic star (Pentacle)
        draw_star(draw, cx, cy - 20, 140, 54, 5, fill=(40, 20, 60, 220), outline=(255, 215, 0, 255))
        # Center purifying white flame
        draw.ellipse([cx - 15, cy - 40, cx + 15, cy], fill=(255, 255, 255, 255))
        draw.polygon([(cx, cy - 65), (cx - 15, cy - 25), (cx + 15, cy - 25)], fill=(255, 240, 100, 255))
        # Arcane glyphs on points
        for i in range(5):
            ang = i * (2 * math.pi / 5) - math.pi / 2
            gx = cx + 115 * math.cos(ang)
            gy = cy - 20 + 115 * math.sin(ang)
            draw_star(draw, gx, gy, 14, 5, 4, fill=(255, 255, 255, 255))

    elif motif_type == "removing_witchcraft":
        # Blazing solar wheel with sacred trishul cutting through dark hex chains
        draw_glow(img, cx, cy - 20, 240, (255, 120, 20, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 240, 100, 200))
        # 12-Spoke Solar Wheel
        for i in range(12):
            ang = i * (2 * math.pi / 12)
            x1 = cx + 50 * math.cos(ang)
            y1 = cy - 20 + 50 * math.sin(ang)
            x2 = cx + 175 * math.cos(ang)
            y2 = cy - 20 + 175 * math.sin(ang)
            draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 220), width=6)
        # Breaking dark chain links
        draw.arc([cx - 130, cy - 20 - 40, cx - 50, cy - 20 + 40], start=0, end=360, fill=(120, 120, 140, 255), width=8)
        draw.arc([cx + 50, cy - 20 - 40, cx + 130, cy - 20 + 40], start=0, end=360, fill=(120, 120, 140, 255), width=8)
        # Divine Golden Sword / Trishul Spear slicing in center
        draw.polygon([(cx, cy - 160), (cx - 16, cy + 80), (cx + 16, cy + 80)], fill=(255, 255, 255, 255), outline=(255, 215, 0, 255), width=3)
        draw.rectangle([cx - 40, cy + 70, cx + 40, cy + 85], fill=(212, 175, 55, 255))
        draw.rectangle([cx - 8, cy + 85, cx + 8, cy + 130], fill=(212, 175, 55, 255))
        draw.ellipse([cx - 18, cy + 125, cx + 18, cy + 155], fill=(255, 215, 0, 255))
        draw_star(draw, cx, cy - 20, 45, 15, 8, fill=(255, 255, 255, 255))

    elif motif_type == "enemy_solutions":
        # Baglamukhi golden warrior shield with fierce lion crest and victory thunderbolt
        draw_glow(img, cx, cy - 20, 240, (255, 190, 30, 170))
        draw_glow(img, cx, cy - 20, 140, (255, 245, 160, 210))
        # Crossed Vajra / Thunderbolt Spears
        draw.line([cx - 140, cy - 130, cx + 140, cy + 90], fill=(212, 175, 55, 255), width=10)
        draw.line([cx + 140, cy - 130, cx - 140, cy + 90], fill=(212, 175, 55, 255), width=10)
        # Golden Shield
        shield_pts = [
            (cx - 110, cy - 130), (cx + 110, cy - 130),
            (cx + 110, cy + 10), (cx, cy + 130), (cx - 110, cy + 10)
        ]
        draw.polygon(shield_pts, fill=(212, 175, 55, 255), outline=(255, 245, 180, 255), width=6)
        # Inner Shield Inset
        inner_pts = [
            (cx - 90, cy - 115), (cx + 90, cy - 115),
            (cx + 90, cy + 5), (cx, cy + 105), (cx - 90, cy + 5)
        ]
        draw.polygon(inner_pts, fill=(35, 18, 55, 255), outline=(255, 215, 0, 255), width=3)
        # Lion / Solar Crest in Shield
        draw_star(draw, cx, cy - 10, 65, 28, 8, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255))
        draw.ellipse([cx - 25, cy - 35, cx + 25, cy + 15], fill=(212, 175, 55, 255))
        # Victory Laurel beneath
        for i in range(-3, 4):
            lx = cx + i * 28
            ly = cy + 120 - abs(i) * 5
            draw.ellipse([lx - 8, ly - 5, lx + 8, ly + 5], fill=(255, 215, 0, 255))

def generate_all():
    os.makedirs('public/images/our_service_img', exist_ok=True)
    for num, title, motif in SERVICES:
        print(f"Generating Service {num}: {title}...")
        img = create_card_base(seed=num * 100)
        draw_motif(img, motif)
        add_title_ribbon(img, title)
        
        # Supersample down to 400x400
        out_img = img.resize((400, 400), Image.Resampling.LANCZOS)
        out_path = f"public/images/our_service_img/pro_im_{num}.png"
        out_img.save(out_path, format="PNG", optimize=True)
        print(f"Saved: {out_path}")

if __name__ == '__main__':
    generate_all()
