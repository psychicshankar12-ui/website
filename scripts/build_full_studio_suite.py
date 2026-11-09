import os
import math
import urllib.request
import io
import time
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

SW, SH = 1600, 1600
FINAL_BADGE_SIZE = (800, 800)
scx, scy = SW // 2, SH // 2

# Fonts
FONT_TITLE = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 88)
FONT_PSYCHIC = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 70)
FONT_SHANKAR = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 68)

SERVICES = [
    (1, ["GET YOUR EX", "LOVE BACK"], "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=85"),
    (2, ["LOVE RELATIONSHIP", "PROBLEM"], "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=85"),
    (3, ["BLACK MAGIC", "SPECIALIST"], "https://upload.wikimedia.org/wikipedia/commons/b/b3/Havan_kund_%28_Fire_pit_%29.jpg"),
    (4, ["SPIRITUAL", "HEALING"], "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=85"),
    (5, ["PSYCHIC", "READING"], "https://upload.wikimedia.org/wikipedia/commons/5/5d/Celtic_Cross_Tarot_Spread.jpg"),
    (6, ["HUSBAND AND WIFE", "DISPUTE"], "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1200&q=85"),
    (7, ["NEGATIVE ENERGY", "REMOVAL"], "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=1200&q=85"),
    (8, ["EVIL SPIRIT", "REMOVAL"], "https://upload.wikimedia.org/wikipedia/commons/f/f3/Aarti%2C_Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg"),
    (9, ["POWERFUL", "LOVE SPELLS"], "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=85"),
    (10, ["PARTNER IN", "YOUR CONTROL"], "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=1200&q=85"),
    (11, ["STOP CHEATING", "PARTNER"], "LOCAL:/tmp/reference_badge.png"),
    (12, ["STOP SEPARATION", "/ DIVORCE"], "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=85"),
    (13, ["JEALOUSY AND CURSE", "REMOVAL"], "LOCAL:/tmp/evil_eye.jpg"),
    (14, ["BAD LUCK", "REMOVAL"], "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=1200&q=85"),
    (15, ["CHILDLESS", "COUPLES"], "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=85"),
    (16, ["FINANCIAL / BUSINESS", "PROBLEM"], "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=85"),
    (17, ["HEALTH ISSUES", "PROBLEM"], "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=85"),
    (18, ["VOODOO SPELL", "CASTER"], "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=85"),
    (19, ["REMOVING", "WITCHCRAFT"], "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=1200&q=85"),
    (20, ["ENEMY PROBLEM", "SOLUTIONS"], "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=85"),
]

def load_image(src):
    if src.startswith("LOCAL:"):
        return Image.open(src.replace("LOCAL:", "")).convert('RGBA')
    req = urllib.request.Request(src, headers={'User-Agent': 'PsychicShankarBot/3.0'})
    for _ in range(3):
        try:
            content = urllib.request.urlopen(req, timeout=12).read()
            return Image.open(io.BytesIO(content)).convert('RGBA')
        except Exception as e:
            time.sleep(1.2)
    return None

def build_single_badge(num, title_lines, photo_src):
    raw_im = load_image(photo_src)
    if raw_im is None:
        print(f"Failed to load image for Service {num}")
        return False
        
    if photo_src == "LOCAL:/tmp/reference_badge.png":
        min_dim = min(raw_im.size)
        crop_im = raw_im.crop((30, 30, min_dim - 30, min_dim - 30)).resize((1420, 1420), Image.Resampling.LANCZOS)
    else:
        min_dim = min(raw_im.size)
        left = (raw_im.width - min_dim) // 2
        top = (raw_im.height - min_dim) // 2
        crop_im = raw_im.crop((left, top, left + min_dim, top + min_dim)).resize((1420, 1420), Image.Resampling.LANCZOS)
        
    crop_im = ImageEnhance.Color(crop_im).enhance(1.18)
    crop_im = ImageEnhance.Contrast(crop_im).enhance(1.12)
    crop_im = ImageEnhance.Sharpness(crop_im).enhance(1.2)
    
    canvas = Image.new('RGBA', (SW, SH), (0, 0, 0, 0))
    photo_radius = 708
    mask = Image.new('L', (1420, 1420), 0)
    ImageDraw.Draw(mask).ellipse([2, 2, 1418, 1418], fill=255)
    canvas.paste(crop_im, (90, 90), mask)
    
    # Soft vignette at bottom of photo
    vignette = Image.new('RGBA', (SW, SH), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for y in range(800, 1500):
        alpha = int(180 * ((y - 800) / 700.0) ** 1.5)
        vdraw.line([(0, y), (SW, y)], fill=(0, 0, 0, alpha))
    v_mask = Image.new('L', (SW, SH), 0)
    ImageDraw.Draw(v_mask).ellipse([scx - photo_radius, scy - photo_radius, scx + photo_radius, scy + photo_radius], fill=255)
    canvas.paste(vignette, (0, 0), v_mask)
    
    draw = ImageDraw.Draw(canvas)
    
    # Outer Red Gradient Ring (Radius 788 to 710)
    outer_r = 788
    inner_r = 710
    ring_thick = outer_r - inner_r
    for r in range(outer_r, inner_r, -2):
        f = (outer_r - r) / float(ring_thick)
        red = int(225 * (1 - f) + 175 * f)
        green = int(30 * (1 - f) + 12 * f)
        blue = int(35 * (1 - f) + 18 * f)
        draw.ellipse([scx - r, scy - r, scx + r, scy + r], outline=(red, green, blue, 255), width=3)
        
    draw.ellipse([scx - outer_r, scy - outer_r, scx + outer_r, scy + outer_r], outline=(180, 20, 20, 255), width=5)
    draw.ellipse([scx - inner_r, scy - inner_r, scx + inner_r, scy + inner_r], outline=(140, 10, 10, 255), width=4)
    draw.ellipse([scx - outer_r + 2, scy - outer_r + 2, scx + outer_r - 2, scy + outer_r - 2], outline=(255, 215, 120, 160), width=2)
    draw.ellipse([scx - inner_r - 2, scy - inner_r - 2, scx + inner_r + 2, scy + inner_r + 2], outline=(255, 215, 120, 160), width=2)
    
    # White Dotted Ring at radius 749 (72 dots)
    num_dots = 72
    dot_radius = 749
    for i in range(num_dots):
        ang = i * (2 * math.pi / num_dots)
        dx = scx + dot_radius * math.cos(ang)
        dy = scy + dot_radius * math.sin(ang)
        draw.ellipse([dx - 11, dy - 11, dx + 11, dy + 11], fill=(255, 255, 255, 255))
        draw.ellipse([dx - 13, dy - 13, dx + 13, dy + 13], outline=(255, 230, 150, 120), width=2)
        
    # Service Title Rendering
    line_h = 105
    total_h = len(title_lines) * line_h
    start_y = 1110 - total_h
    for idx, line in enumerate(title_lines):
        line = line.strip()
        bbox = FONT_TITLE.getbbox(line)
        tw = bbox[2] - bbox[0]
        tx = (SW - tw) // 2
        ty = start_y + idx * line_h
        for ox in range(-8, 9):
            for oy in range(-8, 9):
                if ox != 0 or oy != 0:
                    draw.text((tx + ox, ty + oy), line, fill=(0, 0, 0, 255), font=FONT_TITLE)
        draw.text((tx, ty), line, fill=(255, 255, 255, 255), font=FONT_TITLE)
        
    # Red "PSYCHIC" Badge
    py1, py2 = 1260, 1370
    pw_half = 260
    draw.rounded_rectangle([scx - pw_half, py1, scx + pw_half, py2], radius=24, fill=(225, 25, 30, 255), outline=(255, 255, 255, 230), width=4)
    draw.rounded_rectangle([scx - pw_half + 4, py1 + 4, scx + pw_half - 4, py2 - 4], radius=20, outline=(255, 180, 180, 120), width=2)
    p_box = FONT_PSYCHIC.getbbox("PSYCHIC")
    pw = p_box[2] - p_box[0]
    draw.text((scx - pw // 2, py1 + 16), "PSYCHIC", fill=(255, 255, 255, 255), font=FONT_PSYCHIC)
    
    # Black "SHANKAR" Badge
    sy1, sy2 = 1385, 1495
    sw_half = 300
    draw.rounded_rectangle([scx - sw_half - 4, sy1 - 4, scx + sw_half + 4, sy2 + 4], radius=32, fill=(0, 0, 0, 180))
    draw.rounded_rectangle([scx - sw_half, sy1, scx + sw_half, sy2], radius=28, fill=(12, 12, 14, 255), outline=(255, 255, 255, 240), width=3)
    s_box = FONT_SHANKAR.getbbox("SHANKAR")
    sw = s_box[2] - s_box[0]
    draw.text((scx - sw // 2, sy1 + 18), "SHANKAR", fill=(255, 255, 255, 255), font=FONT_SHANKAR)
    
    final_badge = canvas.resize(FINAL_BADGE_SIZE, Image.Resampling.LANCZOS)
    
    # Save to public
    out_public = f'public/images/our_service_img/pro_im_{num}.png'
    final_badge.save(out_public, format='PNG', optimize=True)
    
    # Also save to artifact brain directory for previewing
    out_brain = f'/Users/jalal/.gemini/antigravity/brain/09896cf4-9648-44bf-981d-91ccd06d86de/badge_{num}.png'
    final_badge.save(out_brain, format='PNG', optimize=True)
    print(f"Generated Service {num} -> {out_public}")
    return True


# Build all 8 Feature Medallion Badges (sp_fea_01 to sp_fea_08)
def build_feature_badges():
    print("Building 8 Ultra-High-Contrast Feature Medallions...")
    BW, BH = 658, 664
    TARGET = (329, 332)
    bcx, bcy = BW // 2, BH // 2

    FONT_FEA_NUM = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 54)
    FONT_FEA_LBL = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 28)
    FONT_FEA_SM = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 24)

    FEATURES = [
        (1, "25+", "YEARS", "EXPERIENCE", "star"),
        (2, "15,000+", "HAPPY", "CLIENTS", "heart"),
        (3, "100%", "PRIVATE", "CONFIDENTIAL", "shield"),
        (4, "VEDIC", "ACCURATE", "PREDICTIONS", "eye"),
        (5, "RAPID", "REMEDIES", "PUJAS", "yantra"),
        (6, "24/7", "ON CALL", "SUPPORT", "phone"),
        (7, "ALL FAITH", "WELCOME", "GUIDANCE", "lotus"),
        (8, "100%", "GUARANTEED", "RESULTS", "ribbon"),
    ]

    for num, t1, t2, t3, icon_type in FEATURES:
        canvas = Image.new('RGBA', (BW, BH), (0, 0, 0, 0))
        draw = ImageDraw.Draw(canvas)
        
        # 1. 24k Gold Outer Medallion with bevel
        outer_r = 300
        inner_r = 240
        for r in range(outer_r, inner_r, -2):
            f = (outer_r - r) / float(outer_r - inner_r)
            # Radiant 24k gold gradient
            g_red = int(255 * (1 - f) + 210 * f)
            g_grn = int(215 * (1 - f) + 160 * f)
            g_blu = int(70 * (1 - f) + 20 * f)
            draw.ellipse([bcx - r, bcy - r, bcx + r, bcy + r], outline=(g_red, g_grn, g_blu, 255), width=3)
            
        # Inner dark obsidian velvet disc
        draw.ellipse([bcx - inner_r + 4, bcy - inner_r + 4, bcx + inner_r - 4, bcy + inner_r - 4], fill=(16, 12, 34, 255))
        # Gold inner trim ring
        draw.ellipse([bcx - inner_r + 14, bcy - inner_r + 14, bcx + inner_r - 14, bcy + inner_r - 14], outline=(255, 220, 100, 200), width=3)
        
        # 2. Glowing icon or symbol at top
        iy = bcy - 120
        if icon_type == "star":
            draw.text((bcx - 22, iy - 30), "✦", fill=(255, 235, 120, 255), font=FONT_FEA_NUM)
        elif icon_type == "shield":
            draw.rounded_rectangle([bcx - 26, iy - 26, bcx + 26, iy + 30], radius=8, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=2)
        elif icon_type == "heart":
            draw.text((bcx - 20, iy - 28), "♥", fill=(255, 100, 120, 255), font=FONT_FEA_NUM)
        elif icon_type == "eye":
            draw.ellipse([bcx - 36, iy - 18, bcx + 36, iy + 18], outline=(255, 215, 0, 255), width=4)
            draw.ellipse([bcx - 14, iy - 14, bcx + 14, iy + 14], fill=(255, 240, 150, 255))
        else:
            draw.ellipse([bcx - 24, iy - 24, bcx + 24, iy + 24], outline=(255, 215, 0, 255), width=4)
            draw.ellipse([bcx - 10, iy - 10, bcx + 10, iy + 10], fill=(255, 240, 120, 255))
            
        # 3. Text lines
        bb1 = FONT_FEA_NUM.getbbox(t1)
        w1 = bb1[2] - bb1[0]
        draw.text((bcx - w1 // 2, bcy - 40), t1, fill=(255, 235, 120, 255), font=FONT_FEA_NUM)
        
        bb2 = FONT_FEA_LBL.getbbox(t2)
        w2 = bb2[2] - bb2[0]
        draw.text((bcx - w2 // 2, bcy + 25), t2, fill=(255, 255, 255, 255), font=FONT_FEA_LBL)
        
        bb3 = FONT_FEA_SM.getbbox(t3)
        w3 = bb3[2] - bb3[0]
        draw.text((bcx - w3 // 2, bcy + 68), t3, fill=(245, 205, 90, 255), font=FONT_FEA_SM)
        
        # 4. Downscale with LANCZOS to 329 x 332
        badge_final = canvas.resize(TARGET, Image.Resampling.LANCZOS)
        out_path = f'public/images/sp_fea_0{num}.png'
        badge_final.save(out_path, format='PNG', optimize=True)
        # Copy to brain dir
        badge_final.save(f'/Users/jalal/.gemini/antigravity/brain/09896cf4-9648-44bf-981d-91ccd06d86de/fea_{num}.png', format='PNG', optimize=True)
        print(f"Generated Feature Badge {num}: {out_path}")

if __name__ == '__main__':
    print("=== Generating Full 20 Ultra-Definition Service Suite ===")
    for num, lines, src in SERVICES:
        build_single_badge(num, lines, src)
        time.sleep(0.4)
    print("=== Generating 8 Feature Medallions ===")
    build_feature_badges()
    print("ALL ASSETS FULLY GENERATED!")

