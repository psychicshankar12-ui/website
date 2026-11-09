import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 658, 664

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

def create_circular_badge_base(cx, cy, radius):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer drop shadow
    draw.ellipse([cx - radius - 8, cy - radius - 4, cx + radius + 8, cy + radius + 12], fill=(0, 0, 0, 120))
    
    # Outer 24k Gold Beveled Ring
    for r in range(radius, radius - 28, -1):
        f = (radius - r) / 28.0
        # Gold gradient highlights
        if f < 0.3:
            col = (255, 235, 140, 255)
        elif f < 0.7:
            col = (212, 175, 55, 255)
        else:
            col = (160, 120, 25, 255)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=2)
        
    # Inner dark cosmic circle
    inner_r = radius - 26
    for r in range(inner_r, 0, -4):
        f = (r / float(inner_r)) ** 1.3
        red = int(45 * (1 - f) + 12 * f)
        green = int(18 * (1 - f) + 8 * f)
        blue = int(75 * (1 - f) + 26 * f)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue, 255))
        
    # Beaded ring inside gold rim
    for i in range(40):
        ang = i * (2 * math.pi / 40)
        bx = cx + (inner_r - 12) * math.cos(ang)
        by = cy + (inner_r - 12) * math.sin(ang)
        draw.ellipse([bx - 3, by - 3, bx + 3, by + 3], fill=(255, 235, 140, 255))
        
    return img

def render_badge(num, title_top, main_text, sub_text, icon_type):
    cx, cy = W // 2, H // 2
    radius = 300
    img = create_circular_badge_base(cx, cy, radius)
    draw = ImageDraw.Draw(img)
    
    # Arching / Top Text
    f_top = get_font(26, bold=True)
    t_bbox = f_top.getbbox(title_top)
    tw = t_bbox[2] - t_bbox[0]
    draw.text(((W - tw) // 2, cy - 220), title_top, fill=(255, 220, 100, 255), font=f_top)
    
    # Specific Icon in center-upper
    ic_y = cy - 40
    if icon_type == "laurel_medal":
        # Laurel leaves
        for i in range(-5, 6):
            if i == 0: continue
            ang = math.radians(i * 18 - 90)
            lx = cx + 130 * math.cos(ang)
            ly = ic_y + 110 * math.sin(ang) + 40
            draw.ellipse([lx - 14, ly - 8, lx + 14, ly + 8], fill=(255, 215, 0, 255), outline=(180, 130, 20, 255), width=2)
        # Golden Trophy / Star
        draw_star(draw, cx, ic_y - 30, 65, 26, 8, fill=(255, 235, 120, 255), outline=(212, 175, 55, 255))
        
    elif icon_type == "happy_clients":
        # 5 Golden Stars
        for idx, offset_x in enumerate([-100, -50, 0, 50, 100]):
            star_y = ic_y - 70 + abs(offset_x) // 4
            draw_star(draw, cx + offset_x, star_y, 22, 9, 5, fill=(255, 215, 0, 255))
        # Clasped prayer hands / heart
        pts = []
        for t_deg in range(0, 360, 5):
            t = math.radians(t_deg)
            x = 16 * (math.sin(t) ** 3)
            y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
            pts.append((cx + x * 2.8, ic_y + 10 + y * 2.8))
        draw.polygon(pts, fill=(230, 40, 80, 255), outline=(255, 215, 0, 255))
        draw_star(draw, cx, ic_y + 10, 18, 7, 6, fill=(255, 255, 255, 255))

    elif icon_type == "confidential_lock":
        # Security shield
        shield = [(cx - 80, ic_y - 70), (cx + 80, ic_y - 70), (cx + 80, ic_y + 20), (cx, ic_y + 90), (cx - 80, ic_y + 20)]
        draw.polygon(shield, fill=(212, 175, 55, 255), outline=(255, 245, 160, 255), width=4)
        # Padlock shackle
        draw.arc([cx - 40, ic_y - 65, cx + 40, ic_y], start=180, end=360, fill=(255, 255, 255, 255), width=10)
        # Padlock body
        draw.rounded_rectangle([cx - 45, ic_y - 15, cx + 45, ic_y + 55], radius=10, fill=(35, 18, 55, 255), outline=(255, 215, 0, 255), width=3)
        # Keyhole
        draw.ellipse([cx - 10, ic_y + 5, cx + 10, ic_y + 25], fill=(255, 215, 0, 255))
        draw.polygon([(cx - 6, ic_y + 20), (cx + 6, ic_y + 20), (cx + 10, ic_y + 45), (cx - 10, ic_y + 45)], fill=(255, 215, 0, 255))

    elif icon_type == "accurate_eye":
        # All Seeing Eye & Crystal Vision
        draw.arc([cx - 110, ic_y - 70, cx + 110, ic_y + 30], start=0, end=180, fill=(255, 215, 0, 255), width=8)
        draw.arc([cx - 110, ic_y - 90, cx + 110, ic_y + 10], start=180, end=360, fill=(255, 215, 0, 255), width=8)
        # Iris & Pupil
        draw.ellipse([cx - 45, ic_y - 65, cx + 45, ic_y + 25], fill=(30, 80, 180, 255), outline=(255, 255, 255, 255), width=3)
        draw.ellipse([cx - 20, ic_y - 40, cx + 20, ic_y], fill=(10, 10, 25, 255))
        draw_star(draw, cx + 6, ic_y - 25, 10, 4, 4, fill=(255, 255, 255, 255))
        # Radiant Sight Beams
        for a in [-45, -30, -15, 0, 15, 30, 45]:
            rad = math.radians(a - 90)
            x1 = cx + 80 * math.cos(rad)
            y1 = ic_y - 20 + 80 * math.sin(rad)
            x2 = cx + 120 * math.cos(rad)
            y2 = ic_y - 20 + 120 * math.sin(rad)
            draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 200), width=3)

    elif icon_type == "fast_remedies":
        # Yantra & Lightning Bolt of Rapid Solutions
        # Sacred Triangle
        draw.polygon([(cx, ic_y - 80), (cx - 75, ic_y + 35), (cx + 75, ic_y + 35)], outline=(255, 215, 0, 255), width=4)
        draw.polygon([(cx, ic_y + 60), (cx - 75, ic_y - 55), (cx + 75, ic_y - 55)], outline=(255, 215, 0, 255), width=4)
        # Golden Lightning Bolt
        bolt = [(cx + 10, ic_y - 95), (cx - 30, ic_y - 15), (cx + 5, ic_y - 15), (cx - 15, ic_y + 65), (cx + 35, ic_y - 5), (cx, ic_y - 5)]
        draw.polygon(bolt, fill=(255, 245, 100, 255), outline=(255, 180, 20, 255), width=2)

    elif icon_type == "call_247":
        # Golden Telephone receiver & 24/7 Cosmic Signals
        draw.arc([cx - 75, ic_y - 65, cx + 75, ic_y + 45], start=40, end=140, fill=(255, 215, 0, 255), width=22)
        # Earpieces
        draw.ellipse([cx - 85, ic_y - 65, cx - 45, ic_y - 25], fill=(255, 235, 140, 255), outline=(212, 175, 55, 255), width=3)
        draw.ellipse([cx + 45, ic_y - 65, cx + 85, ic_y - 25], fill=(255, 235, 140, 255), outline=(212, 175, 55, 255), width=3)
        # Signal Waves above
        for r in [55, 80, 105]:
            draw.arc([cx - r, ic_y - 80 - r // 2, cx + r, ic_y - 80 + r // 2], start=220, end=320, fill=(255, 215, 0, 180), width=4)

    elif icon_type == "all_religions":
        # Blooming universal Lotus & sacred unity mandala
        for i in range(8):
            ang = i * (2 * math.pi / 8)
            lx = cx + 55 * math.cos(ang)
            ly = ic_y - 15 + 55 * math.sin(ang)
            draw.ellipse([lx - 22, ly - 22, lx + 22, ly + 22], fill=(255, 160, 200, 200), outline=(255, 215, 0, 255), width=2)
        # Center Golden Om / Sun
        draw.ellipse([cx - 35, ic_y - 50, cx + 35, ic_y + 20], fill=(255, 215, 0, 255))
        draw_star(draw, cx, ic_y - 15, 30, 12, 8, fill=(255, 255, 255, 255))

    elif icon_type == "guaranteed":
        # Certified 100% Gold Seal with Ribbon Tails
        # Ribbon tails below
        draw.polygon([(cx - 70, ic_y + 20), (cx - 100, ic_y + 90), (cx - 65, ic_y + 75), (cx - 30, ic_y + 90), (cx - 30, ic_y + 35)], fill=(200, 30, 40, 255), outline=(255, 215, 0, 255), width=2)
        draw.polygon([(cx + 70, ic_y + 20), (cx + 100, ic_y + 90), (cx + 65, ic_y + 75), (cx + 30, ic_y + 90), (cx + 30, ic_y + 35)], fill=(200, 30, 40, 255), outline=(255, 215, 0, 255), width=2)
        # Gold Star Rosette
        draw_star(draw, cx, ic_y - 15, 85, 68, 16, fill=(255, 215, 0, 255), outline=(255, 245, 180, 255))
        draw.ellipse([cx - 55, ic_y - 70, cx + 55, ic_y + 40], fill=(200, 30, 40, 255), outline=(255, 245, 180, 255), width=3)
        # 100% Text
        f_num = get_font(34, bold=True)
        draw.text((cx - 44, ic_y - 35), "100%", fill=(255, 255, 255, 255), font=f_num)

    # Main Text
    f_main = get_font(42, bold=True)
    mb = f_main.getbbox(main_text)
    mw = mb[2] - mb[0]
    draw.text(((W - mw) // 2, cy + 90), main_text, fill=(255, 255, 255, 255), font=f_main)
    
    # Sub Text
    f_sub = get_font(28, bold=True)
    sb = f_sub.getbbox(sub_text)
    sw = sb[2] - sb[0]
    draw.text(((W - sw) // 2, cy + 150), sub_text, fill=(255, 215, 0, 255), font=f_sub)
    
    return img

FEATURES = [
    (1, "VEDIC ASTROLOGY", "25+ YEARS", "EXPERIENCE", "laurel_medal"),
    (2, "GLOBAL CLIENTS", "15,000+", "HAPPY CLIENTS", "happy_clients"),
    (3, "ABSOLUTE PRIVACY", "100% PRIVATE", "CONFIDENTIAL", "confidential_lock"),
    (4, "DEEP CLAIRVOYANCE", "ACCURATE", "PREDICTIONS", "accurate_eye"),
    (5, "VEDIC MANTRAS", "RAPID REMEDIES", "SOLUTIONS", "fast_remedies"),
    (6, "ALWAYS HERE", "24/7 ON CALL", "SUPPORT", "call_247"),
    (7, "UNIVERSAL BLESSINGS", "ALL FAITHS", "WELCOME", "all_religions"),
    (8, "PROVEN ASTROLOGY", "GUARANTEED", "RESULTS", "guaranteed"),
]

def generate_badges():
    os.makedirs('public/images', exist_ok=True)
    os.makedirs('public/images/seo', exist_ok=True)
    
    for num, top, main_t, sub_t, icon in FEATURES:
        # 1. Generate 329x332 PNG badge
        badge_img = render_badge(num, top, main_t, sub_t, icon)
        badge_resized = badge_img.resize((329, 332), Image.Resampling.LANCZOS)
        badge_path = f"public/images/sp_fea_0{num}.png"
        badge_resized.save(badge_path, format="PNG", optimize=True)
        print(f"Saved: {badge_path}")
        
        # 2. Generate 380x254 WEBP card
        card_w, card_h = 760, 508
        card = Image.new('RGB', (card_w, card_h), (12, 10, 32))
        cdraw = ImageDraw.Draw(card)
        
        # Gradient on card
        for y in range(card_h):
            factor = y / card_h
            r = int(25 * (1 - factor) + 8 * factor)
            g = int(12 * (1 - factor) + 5 * factor)
            b = int(55 * (1 - factor) + 20 * factor)
            cdraw.line([(0, y), (card_w, y)], fill=(r, g, b))
            
        # Border
        cdraw.rectangle([12, 12, card_w - 12, card_h - 12], outline=(212, 175, 55, 255), width=4)
        cdraw.rectangle([18, 18, card_w - 18, card_h - 18], outline=(255, 235, 140, 120), width=1)
        
        # Paste scaled badge on left
        badge_card_scale = badge_img.resize((380, 384), Image.Resampling.LANCZOS)
        card.paste(badge_card_scale, (30, (card_h - 384) // 2), badge_card_scale)
        
        # Text on right
        f_b = get_font(26, bold=True)
        cdraw.text((430, 130), "✦ PSYCHIC SHANKAR ✦", fill=(255, 215, 0), font=f_b)
        
        f_m = get_font(42, bold=True)
        cdraw.text((430, 180), main_t, fill=(255, 255, 255), font=f_m)
        
        f_s = get_font(32, bold=True)
        cdraw.text((430, 240), sub_t, fill=(255, 220, 110), font=f_s)
        
        f_d = get_font(22, bold=False)
        cdraw.text((430, 310), "Trusted Vedic Master", fill=(200, 200, 220), font=f_d)
        cdraw.text((430, 345), "USA & Worldwide", fill=(200, 200, 220), font=f_d)
        
        card_out = card.resize((380, 254), Image.Resampling.LANCZOS)
        webp_path = f"public/images/seo/sp{num}.webp"
        card_out.save(webp_path, format="WEBP", quality=92)
        print(f"Saved: {webp_path}")

if __name__ == '__main__':
    generate_badges()
