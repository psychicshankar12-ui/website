import math
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 400, 400
cx, cy = 200, 200
radius = 180

def get_font(size, bold=True):
    path = '/System/Library/Fonts/Supplemental/Impact.ttf' if bold else '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', size)

def draw_star(draw, x, y, r_out, r_in, points, fill, outline=None):
    angle = math.pi / points
    pts = []
    for i in range(2 * points):
        r = r_out if i % 2 == 0 else r_in
        a = i * angle - math.pi / 2
        pts.append((x + r * math.cos(a), y + r * math.sin(a)))
    draw.polygon(pts, fill=fill, outline=outline)

def create_base():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 1. Outer golden aura
    for r in range(radius + 14, radius, -2):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 215, 0, 40), width=2)
        
    # 2. Rich 24K Gold Beveled Rim
    for r in range(radius, radius - 16, -1):
        f = (radius - r) / 16.0
        col = (255, int(230 - 35 * f), int(120 - 90 * f), 255)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=2)
        
    # 3. Vibrant Ruby/Red Inner Disk (Maximum contrast against dark cards!)
    inner_r = radius - 15
    for r in range(inner_r, 0, -3):
        f = (r / float(inner_r)) ** 1.2
        red = int(240 * (1 - f) + 165 * f)
        green = int(50 * (1 - f) + 18 * f)
        blue = int(45 * (1 - f) + 18 * f)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue, 255))
        
    # 4. White Dotted Inner Ring
    num_dots = 44
    for i in range(num_dots):
        ang = i * (2 * math.pi / num_dots)
        dx = cx + (inner_r - 12) * math.cos(ang)
        dy = cy + (inner_r - 12) * math.sin(ang)
        draw.ellipse([dx - 3, dy - 3, dx + 3, dy + 3], fill=(255, 255, 255, 255))
        
    return img

def render_feature_badge(num):
    img = create_base()
    draw = ImageDraw.Draw(img)
    
    if num == 1:
        # 25+ Years Experience: Trophy Cup & "25+"
        # Laurel leaves on sides
        for i in range(-4, 5):
            if i == 0: continue
            ang = math.radians(i * 22 - 90)
            lx = cx + 115 * math.cos(ang)
            ly = cy + 100 * math.sin(ang) + 10
            draw.ellipse([lx - 12, ly - 7, lx + 12, ly + 7], fill=(255, 215, 0, 255), outline=(255, 255, 255, 200), width=1)
        # Trophy cup
        cup = [(cx - 60, cy - 65), (cx + 60, cy - 65), (cx + 45, cy + 20), (cx - 45, cy + 20)]
        draw.polygon(cup, fill=(255, 220, 50, 255), outline=(255, 255, 255, 255), width=3)
        # Handles
        draw.arc([cx - 90, cy - 60, cx - 40, cy], start=90, end=270, fill=(255, 215, 0, 255), width=8)
        draw.arc([cx + 40, cy - 60, cx + 90, cy], start=270, end=90, fill=(255, 215, 0, 255), width=8)
        # Stem & base
        draw.rectangle([cx - 12, cy + 20, cx + 12, cy + 50], fill=(212, 175, 55, 255))
        draw.polygon([(cx - 45, cy + 50), (cx + 45, cy + 50), (cx + 55, cy + 72), (cx - 55, cy + 72)], fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=2)
        # "25+" text on cup
        f_num = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 38)
        draw.text((cx - 28, cy - 50), "25+", fill=(160, 20, 20, 255), font=f_num)

    elif num == 2:
        # 15,000+ Happy Clients: 5 Golden Stars + Big Heart & Hands
        # 5 Stars at top
        for idx, ox in enumerate([-85, -42, 0, 42, 85]):
            sy = cy - 65 + abs(ox) // 3
            draw_star(draw, cx + ox, sy, 18, 8, 5, fill=(255, 225, 60, 255), outline=(255, 255, 255, 255))
        # Large Golden Heart
        pts = []
        for t_deg in range(0, 360, 5):
            t = math.radians(t_deg)
            x = 16 * (math.sin(t) ** 3)
            y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
            pts.append((cx + x * 4.6, cy + 25 + y * 4.6))
        draw.polygon(pts, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=4)
        # Bold "15K+" on heart
        f_txt = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 32)
        b = f_txt.getbbox("15K+")
        tw = b[2] - b[0]
        draw.text(((W - tw) // 2, cy + 10), "15K+", fill=(180, 20, 20, 255), font=f_txt)

    elif num == 3:
        # 100% Confidential: Heavy Golden Security Shield & Padlock
        # Shield
        shield = [(cx - 75, cy - 70), (cx + 75, cy - 70), (cx + 75, cy + 15), (cx, cy + 85), (cx - 75, cy + 15)]
        draw.polygon(shield, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=4)
        # Padlock shackle
        draw.arc([cx - 35, cy - 55, cx + 35, cy + 5], start=180, end=360, fill=(255, 255, 255, 255), width=10)
        # Padlock body
        draw.rounded_rectangle([cx - 40, cy - 10, cx + 40, cy + 55], radius=10, fill=(160, 20, 20, 255), outline=(255, 255, 255, 255), width=3)
        # Keyhole
        draw.ellipse([cx - 10, cy + 8, cx + 10, cy + 26], fill=(255, 215, 0, 255))
        draw.polygon([(cx - 6, cy + 22), (cx + 6, cy + 22), (cx + 10, cy + 44), (cx - 10, cy + 44)], fill=(255, 215, 0, 255))

    elif num == 4:
        # Accurate Predictions: Large Radiant Third Eye & Sight Beams
        # Piercing rays
        for a in [-50, -30, -10, 10, 30, 50]:
            rad = math.radians(a - 90)
            x1 = cx + 65 * math.cos(rad)
            y1 = cy - 20 + 65 * math.sin(rad)
            x2 = cx + 105 * math.cos(rad)
            y2 = cy - 20 + 105 * math.sin(rad)
            draw.line([x1, y1, x2, y2], fill=(255, 235, 120, 255), width=5)
        # Eye outer arcs
        draw.arc([cx - 95, cy - 60, cx + 95, cy + 25], start=0, end=180, fill=(255, 215, 0, 255), width=9)
        draw.arc([cx - 95, cy - 80, cx + 95, cy + 5], start=180, end=360, fill=(255, 215, 0, 255), width=9)
        # Eyeball
        draw.ellipse([cx - 42, cy - 55, cx + 42, cy + 25], fill=(255, 255, 255, 255), outline=(212, 175, 55, 255), width=4)
        # Iris & Pupil
        draw.ellipse([cx - 25, cy - 38, cx + 25, cy + 12], fill=(20, 60, 140, 255))
        draw.ellipse([cx - 12, cy - 25, cx + 12, cy - 1], fill=(0, 0, 0, 255))
        draw.ellipse([cx + 2, cy - 22, cx + 8, cy - 16], fill=(255, 255, 255, 255))

    elif num == 5:
        # Rapid Remedies: Golden Sri Yantra + Large Dynamic Lightning Bolt
        # Star Yantra background
        draw_star(draw, cx, cy, 80, 45, 8, fill=(212, 175, 55, 200), outline=(255, 255, 255, 255))
        # Bold Lightning Bolt
        bolt = [(cx + 15, cy - 80), (cx - 35, cy - 5), (cx + 10, cy - 5), (cx - 20, cy + 85), (cx + 45, cy + 5), (cx + 5, cy + 5)]
        draw.polygon(bolt, fill=(255, 245, 100, 255), outline=(180, 20, 20, 255), width=3)
        draw.polygon([(p[0] - 2, p[1] - 2) for p in bolt], fill=(255, 255, 255, 220))

    elif num == 6:
        # 24/7 Available On Call: Golden Telephone & 24/7 Badge
        # Signal waves
        for r in [60, 85, 110]:
            draw.arc([cx - r, cy - 75 - r // 2, cx + r, cy - 75 + r // 2], start=215, end=325, fill=(255, 235, 120, 255), width=5)
        # Phone Handset
        draw.arc([cx - 75, cy - 55, cx + 75, cy + 45], start=40, end=140, fill=(255, 215, 0, 255), width=24)
        draw.ellipse([cx - 85, cy - 55, cx - 45, cy - 15], fill=(255, 240, 140, 255), outline=(255, 255, 255, 255), width=3)
        draw.ellipse([cx + 45, cy - 55, cx + 85, cy - 15], fill=(255, 240, 140, 255), outline=(255, 255, 255, 255), width=3)
        # "24/7" pill badge below
        draw.rounded_rectangle([cx - 50, cy + 30, cx + 50, cy + 65], radius=10, fill=(255, 255, 255, 255), outline=(255, 215, 0, 255), width=2)
        f_call = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 24)
        draw.text((cx - 25, cy + 34), "24/7", fill=(180, 20, 20, 255), font=f_call)

    elif num == 7:
        # All Religions Welcome: Beautiful Radiant Golden Lotus
        for i in range(8):
            ang = i * (2 * math.pi / 8)
            lx = cx + 50 * math.cos(ang)
            ly = cy + 50 * math.sin(ang)
            draw.ellipse([lx - 26, ly - 26, lx + 26, ly + 26], fill=(255, 225, 120, 255), outline=(255, 255, 255, 255), width=2)
        # Center Golden Sun / Mandala
        draw.ellipse([cx - 40, cy - 40, cx + 40, cy + 40], fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=3)
        draw_star(draw, cx, cy, 32, 14, 8, fill=(255, 255, 255, 255))
        # Lotus base
        draw.chord([cx - 70, cy + 10, cx + 70, cy + 70], start=0, end=180, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=2)

    elif num == 8:
        # Guaranteed Results: 100% Certified Gold Ribbon & Checkmark
        # Ribbon tails
        draw.polygon([(cx - 65, cy + 25), (cx - 95, cy + 90), (cx - 60, cy + 75), (cx - 25, cy + 90), (cx - 25, cy + 40)], fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=2)
        draw.polygon([(cx + 65, cy + 25), (cx + 95, cy + 90), (cx + 60, cy + 75), (cx + 25, cy + 90), (cx + 25, cy + 40)], fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=2)
        # Rosette Gold Star
        draw_star(draw, cx, cy - 10, 85, 70, 16, fill=(255, 220, 50, 255), outline=(255, 255, 255, 255))
        draw.ellipse([cx - 55, cy - 65, cx + 55, cy + 45], fill=(160, 20, 20, 255), outline=(255, 255, 255, 255), width=3)
        # Big "100%"
        f_guar = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 32)
        b = f_guar.getbbox("100%")
        tw = b[2] - b[0]
        draw.text(((W - tw) // 2, cy - 28), "100%", fill=(255, 255, 255, 255), font=f_guar)
        
    return img

def generate_all():
    os.makedirs('public/images', exist_ok=True)
    os.makedirs('public/images/seo', exist_ok=True)
    
    titles = [
        (1, "25+ Years Experience", "Distinguished Lineage"),
        (2, "15,000+ Happy Clients", "Worldwide Recognition"),
        (3, "100% Confidential", "Absolute Privacy Guaranteed"),
        (4, "Accurate Predictions", "Deep Clairvoyant Insight"),
        (5, "Rapid Remedies", "Vedic Sanskrit Solutions"),
        (6, "24/7 Available On Call", "Urgent Support Anytime"),
        (7, "All Religions Welcome", "Compassionate Guidance"),
        (8, "Guaranteed Results", "Proven Astrological Rituals"),
    ]
    
    for num, title, subtitle in titles:
        badge = render_feature_badge(num)
        
        # 1. Save 329x332 PNG badge
        resized_badge = badge.resize((329, 332), Image.Resampling.LANCZOS)
        badge_path = f'public/images/sp_fea_0{num}.png'
        resized_badge.save(badge_path, format='PNG', optimize=True)
        print(f"Saved Badge: {badge_path}")
        
        # 2. Save 380x254 WEBP card
        card = Image.new('RGB', (380, 254), (12, 14, 38))
        cdraw = ImageDraw.Draw(card)
        # Gradient on card
        for y in range(254):
            f = y / 254.0
            r = int(22 * (1 - f) + 10 * f)
            g = int(14 * (1 - f) + 8 * f)
            b = int(48 * (1 - f) + 24 * f)
            cdraw.line([(0, y), (380, y)], fill=(r, g, b))
        cdraw.rectangle([6, 6, 374, 248], outline=(212, 175, 55), width=2)
        
        # Paste badge on left
        badge_thumb = badge.resize((150, 150), Image.Resampling.LANCZOS)
        card.paste(badge_thumb, (18, 52), badge_thumb)
        
        # Text on right
        f1 = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 13)
        cdraw.text((180, 75), "✦ PSYCHIC SHANKAR ✦", fill=(255, 215, 0), font=f1)
        
        f2 = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 17)
        cdraw.text((180, 105), title, fill=(255, 255, 255), font=f2)
        
        f3 = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 12)
        cdraw.text((180, 138), subtitle, fill=(210, 210, 225), font=f3)
        
        card_path = f'public/images/seo/sp{num}.webp'
        card.save(card_path, format='WEBP', quality=92)
        print(f"Saved Card: {card_path}")

if __name__ == '__main__':
    generate_all()
