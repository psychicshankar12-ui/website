import urllib.request
import io
import math
import os
from PIL import Image, ImageDraw, ImageFont

SERVICES = [
    (1, ["GET YOUR EX", "LOVE BACK"], "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=85"),
    (2, ["LOVE RELATIONSHIP", "PROBLEM"], "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85"),
    (3, ["BLACK MAGIC", "SPECIALIST"], "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=85"),
    (4, ["SPIRITUAL", "HEALING"], "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85"),
    (5, ["PSYCHIC", "READING"], "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=800&q=85"),
    (6, ["HUSBAND AND WIFE", "DISPUTE"], "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=85"),
    (7, ["NEGATIVE ENERGY", "REMOVAL"], "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=800&q=85"),
    (8, ["EVIL SPIRIT", "REMOVAL"], "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=85"),
    (9, ["POWERFUL", "LOVE SPELLS"], "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=85"),
    (10, ["PARTNER IN", "YOUR CONTROL"], "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=85"),
    (11, ["STOP CHEATING", "PARTNER"], "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=85"),
    (12, ["STOP SEPARATION", "/ DIVORCE"], "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=85"),
    (13, ["JEALOUSY AND CURSE", "REMOVAL"], "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=85"),
    (14, ["BAD LUCK", "REMOVAL"], "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&q=85"),
    (15, ["CHILDLESS", "COUPLES"], "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=85"),
    (16, ["FINANCIAL / BUSINESS", "PROBLEM"], "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85"),
    (17, ["HEALTH ISSUES", "PROBLEM"], "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=85"),
    (18, ["VOODOO SPELL", "CASTER"], "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=85"),
    (19, ["REMOVING", "WITCHCRAFT"], "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=85"),
    (20, ["ENEMY PROBLEM", "SOLUTIONS"], "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=85"),
]

W, H = 400, 400
cx, cy = W // 2, H // 2

def create_badge(num, title_lines, image_url):
    badge = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    
    # 1. Fetch photo
    req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        content = urllib.request.urlopen(req, timeout=12).read()
        raw_im = Image.open(io.BytesIO(content)).convert('RGBA')
    except Exception as e:
        print(f"Error fetching {image_url}: {e}")
        return False
        
    # Crop to square center
    min_dim = min(raw_im.size)
    left = (raw_im.width - min_dim) // 2
    top = (raw_im.height - min_dim) // 2
    crop_im = raw_im.crop((left, top, left + min_dim, top + min_dim)).resize((360, 360), Image.Resampling.LANCZOS)
    
    # Circular mask for inner photo (radius 178, diameter 356)
    mask = Image.new('L', (360, 360), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([2, 2, 358, 358], fill=255)
    
    # Paste photo onto badge
    badge.paste(crop_im, (20, 20), mask)
    
    draw = ImageDraw.Draw(badge)
    
    # 2. Draw Red Outer Ring:
    # Outer radius 198, inner radius 178
    for r in range(198, 178, -1):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(228, 48, 42, 255), width=2)
    # Border rims
    draw.ellipse([cx - 198, cy - 198, cx + 198, cy + 198], outline=(155, 18, 18, 255), width=2)
    draw.ellipse([cx - 178, cy - 178, cx + 178, cy + 178], outline=(155, 18, 18, 255), width=2)
    
    # 3. White dotted ring at radius 188
    num_dots = 68
    for i in range(num_dots):
        ang = i * (2 * math.pi / num_dots)
        dx = cx + 188 * math.cos(ang)
        dy = cy + 188 * math.sin(ang)
        draw.ellipse([dx - 2.5, dy - 2.5, dx + 2.5, dy + 2.5], fill=(255, 255, 255, 255))
        
    # 4. Title Text (White with black outline in Impact)
    font_title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 23)
    
    # Determine Y start based on number of lines
    line_h = 27
    total_text_h = len(title_lines) * line_h
    start_y = 285 - total_text_h
    
    for idx, line in enumerate(title_lines):
        line = line.strip()
        bbox = font_title.getbbox(line)
        tw = bbox[2] - bbox[0]
        tx = (W - tw) // 2
        ty = start_y + idx * line_h
        
        # Heavy black outline (stroke)
        for ox in range(-3, 4):
            for oy in range(-3, 4):
                if ox != 0 or oy != 0:
                    draw.text((tx + ox, ty + oy), line, fill=(0, 0, 0, 255), font=font_title)
        draw.text((tx, ty), line, fill=(255, 255, 255, 255), font=font_title)
        
    # 5. Bottom Badges
    # Red "PSYCHIC" rounded pill
    draw.rounded_rectangle([135, 318, 265, 346], radius=6, fill=(225, 45, 40, 255), outline=(255, 255, 255, 220), width=1)
    font_psychic = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 18)
    p_box = font_psychic.getbbox("PSYCHIC")
    pw = p_box[2] - p_box[0]
    draw.text(((W - pw) // 2, 321), "PSYCHIC", fill=(255, 255, 255, 255), font=font_psychic)
    
    # Black "SHANKAR" rounded pill
    draw.rounded_rectangle([125, 348, 275, 376], radius=10, fill=(0, 0, 0, 255))
    font_shankar = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 18)
    s_box = font_shankar.getbbox("SHANKAR")
    sw = s_box[2] - s_box[0]
    draw.text(((W - sw) // 2, 352), "SHANKAR", fill=(255, 255, 255, 255), font=font_shankar)
    
    out_path = f'public/images/our_service_img/pro_im_{num}.png'
    badge.save(out_path, format='PNG', optimize=True)
    print(f"Generated Service {num}: {out_path}")
    return True

def generate_all():
    os.makedirs('public/images/our_service_img', exist_ok=True)
    for num, lines, url in SERVICES:
        create_badge(num, lines, url)

if __name__ == '__main__':
    generate_all()
