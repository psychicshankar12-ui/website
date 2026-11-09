import os
import math
import urllib.request
import io
import time
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

W, H = 400, 400
cx, cy = W // 2, H // 2

# Fonts
font_title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 23)
font_psychic = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 18)
font_shankar = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 18)

# 20 Curated Highly Relevant Service Sources
SERVICES = [
    (1, ["GET YOUR EX", "LOVE BACK"], "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=85"),
    (2, ["LOVE RELATIONSHIP", "PROBLEM"], "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=85"),
    (3, ["BLACK MAGIC", "SPECIALIST"], "https://upload.wikimedia.org/wikipedia/commons/b/b3/Havan_kund_%28_Fire_pit_%29.jpg"),
    (4, ["SPIRITUAL", "HEALING"], "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=85"),
    (5, ["PSYCHIC", "READING"], "https://upload.wikimedia.org/wikipedia/commons/5/5d/Celtic_Cross_Tarot_Spread.jpg"),
    (6, ["HUSBAND AND WIFE", "DISPUTE"], "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=85"),
    (7, ["NEGATIVE ENERGY", "REMOVAL"], "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&q=85"),
    (8, ["EVIL SPIRIT", "REMOVAL"], "https://upload.wikimedia.org/wikipedia/commons/f/f3/Aarti%2C_Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg"),
    (9, ["POWERFUL", "LOVE SPELLS"], "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=85"),
    (10, ["PARTNER IN", "YOUR CONTROL"], "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=600&q=85"),
    (11, ["STOP CHEATING", "PARTNER"], "LOCAL:/tmp/reference_badge.png"),
    (12, ["STOP SEPARATION", "/ DIVORCE"], "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=85"),
    (13, ["JEALOUSY AND CURSE", "REMOVAL"], "LOCAL:/tmp/evil_eye.jpg"),
    (14, ["BAD LUCK", "REMOVAL"], "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&q=85"),
    (15, ["CHILDLESS", "COUPLES"], "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=85"),
    (16, ["FINANCIAL / BUSINESS", "PROBLEM"], "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&q=85"),
    (17, ["HEALTH ISSUES", "PROBLEM"], "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=85"),
    (18, ["VOODOO SPELL", "CASTER"], "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=85"),
    (19, ["REMOVING", "WITCHCRAFT"], "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&q=85"),
    (20, ["ENEMY PROBLEM", "SOLUTIONS"], "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=85"),
]

def load_source_image(source):
    if source.startswith("LOCAL:"):
        path = source.replace("LOCAL:", "")
        return Image.open(path).convert('RGBA')
    
    req = urllib.request.Request(source, headers={'User-Agent': 'PsychicShankarBot/2.0'})
    for attempt in range(3):
        try:
            content = urllib.request.urlopen(req, timeout=12).read()
            return Image.open(io.BytesIO(content)).convert('RGBA')
        except Exception as e:
            print(f"Retry {attempt + 1} for {source}: {e}")
            time.sleep(1.5)
    return None

def build_service_badge(num, title_lines, source):
    raw_im = load_source_image(source)
    if raw_im is None:
        print(f"Failed to load image for Service {num}")
        return False
    
    # If the source is the reference badge itself, extract its inner photo (radius 180)
    if source == "LOCAL:/tmp/reference_badge.png":
        # The reference badge has the couple photo in center
        min_dim = min(raw_im.size)
        crop_im = raw_im.crop((30, 30, min_dim - 30, min_dim - 30)).resize((360, 360), Image.Resampling.LANCZOS)
    else:
        # Standard crop: center square
        min_dim = min(raw_im.size)
        left = (raw_im.width - min_dim) // 2
        top = (raw_im.height - min_dim) // 2
        crop_im = raw_im.crop((left, top, left + min_dim, top + min_dim)).resize((360, 360), Image.Resampling.LANCZOS)

    # Enhance color slightly for vibrancy
    enhancer = ImageEnhance.Color(crop_im)
    crop_im = enhancer.enhance(1.15)
    
    # Slight contrast boost
    c_enhancer = ImageEnhance.Contrast(crop_im)
    crop_im = c_enhancer.enhance(1.1)

    badge = Image.new('RGBA', (W, H), (0, 0, 0, 0))

    # Circular mask for inner photo (radius 178, diameter 356)
    mask = Image.new('L', (360, 360), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([2, 2, 358, 358], fill=255)

    # Paste photo onto badge
    badge.paste(crop_im, (20, 20), mask)

    draw = ImageDraw.Draw(badge)

    # 1. Outer Red Ring: Radius 198 to 178
    for r in range(198, 178, -1):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(228, 48, 42, 255), width=2)
    # Border rims
    draw.ellipse([cx - 198, cy - 198, cx + 198, cy + 198], outline=(155, 18, 18, 255), width=2)
    draw.ellipse([cx - 178, cy - 178, cx + 178, cy + 178], outline=(155, 18, 18, 255), width=2)

    # 2. White dotted ring at radius 188
    num_dots = 68
    for i in range(num_dots):
        ang = i * (2 * math.pi / num_dots)
        dx = cx + 188 * math.cos(ang)
        dy = cy + 188 * math.sin(ang)
        draw.ellipse([dx - 2.5, dy - 2.5, dx + 2.5, dy + 2.5], fill=(255, 255, 255, 255))

    # 3. Title Text (White with heavy black stroke in Impact font)
    line_h = 27
    total_text_h = len(title_lines) * line_h
    start_y = 285 - total_text_h

    for idx, line in enumerate(title_lines):
        line = line.strip()
        bbox = font_title.getbbox(line)
        tw = bbox[2] - bbox[0]
        tx = (W - tw) // 2
        ty = start_y + idx * line_h

        # Heavy black outline (stroke 3px)
        for ox in range(-3, 4):
            for oy in range(-3, 4):
                if ox != 0 or oy != 0:
                    draw.text((tx + ox, ty + oy), line, fill=(0, 0, 0, 255), font=font_title)
        draw.text((tx, ty), line, fill=(255, 255, 255, 255), font=font_title)

    # 4. Bottom Badges
    # Red "PSYCHIC" rounded pill
    draw.rounded_rectangle([135, 318, 265, 346], radius=6, fill=(225, 45, 40, 255), outline=(255, 255, 255, 220), width=1)
    p_box = font_psychic.getbbox("PSYCHIC")
    pw = p_box[2] - p_box[0]
    draw.text(((W - pw) // 2, 321), "PSYCHIC", fill=(255, 255, 255, 255), font=font_psychic)

    # Black "SHANKAR" rounded pill
    draw.rounded_rectangle([125, 348, 275, 376], radius=10, fill=(0, 0, 0, 255))
    s_box = font_shankar.getbbox("SHANKAR")
    sw = s_box[2] - s_box[0]
    draw.text(((W - sw) // 2, 352), "SHANKAR", fill=(255, 255, 255, 255), font=font_shankar)

    out_path = f'public/images/our_service_img/pro_im_{num}.png'
    badge.save(out_path, format='PNG', optimize=True)
    print(f"Generated Service {num}: {out_path}")
    return True

def generate_all():
    os.makedirs('public/images/our_service_img', exist_ok=True)
    os.makedirs('public/images/seo', exist_ok=True)
    
    # 1. Generate All 20 Services
    for num, lines, src in SERVICES:
        build_service_badge(num, lines, src)
        time.sleep(0.5)

    # 2. Generate Psychic Shankar Portrait (about_img3.png & .webp)
    print("Generating Psychic Shankar Portrait from Varanasi Diya Pujan...")
    diya_path = '/tmp/diya_pujan.jpg'
    if not os.path.exists(diya_path):
        url = 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Diya_Pujan_at_Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg'
        req = urllib.request.Request(url, headers={'User-Agent': 'PsychicShankarBot/2.0'})
        with open(diya_path, 'wb') as f:
            f.write(urllib.request.urlopen(req, timeout=12).read())
            
    diya_im = Image.open(diya_path).convert('RGB')
    
    # Target 1200 x 800 (3:2 landscape) centered on the priest and golden tiered diya lamps
    # Original is 2400 x 1600. Perfect 3:2 ratio!
    portrait = diya_im.resize((1200, 800), Image.Resampling.LANCZOS)
    
    # Add subtle warm contrast
    enhancer = ImageEnhance.Color(portrait)
    portrait = enhancer.enhance(1.12)
    c_enhancer = ImageEnhance.Contrast(portrait)
    portrait = c_enhancer.enhance(1.08)
    
    portrait.save('public/images/seo/about_img3.png', format='PNG', optimize=True)
    portrait.save('public/images/seo/about_img3.webp', format='WEBP', quality=95)
    portrait.save('public/images/seo/wel_slider.webp', format='WEBP', quality=95)
    portrait.save('public/images/seo/wel_slider2.webp', format='WEBP', quality=95)
    print("Portrait about_img3.png & about_img3.webp saved!")

if __name__ == '__main__':
    generate_all()
