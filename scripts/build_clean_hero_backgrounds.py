import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

DW, DH = 1900, 714
MW, MH = 480, 516

os.makedirs('public/images/herobanner', exist_ok=True)
os.makedirs('public/images/seo', exist_ok=True)

# Curated right-side artworks for the 6 slides
SLIDE_ARTWORKS = [
    (1, '/tmp/diya_pujan.jpg'), # Vedic Priest Sacred Diya Aarti
    (2, '/tmp/service_candidates/1.jpg'), # Romantic Couple Embrace
    (3, '/tmp/service_candidates/3.jpg'), # Sacred Havan Fire
    (4, '/tmp/service_candidates/12.jpg'), # Wedding Rings & Sacred Union
    (5, '/tmp/service_candidates/4.jpg'), # Spiritual Healing Meditation
    (6, '/tmp/service_candidates/5.jpg'), # Mystic Crystal Ball & Tarot Reading
]

def create_desktop_slide(idx, art_path):
    canvas = Image.new('RGB', (DW, DH), (7, 9, 26))
    draw = ImageDraw.Draw(canvas)
    
    # 1. Base cosmic background gradient
    for x in range(DW):
        f = x / float(DW)
        r = int(7 * (1 - f) + 24 * f)
        g = int(9 * (1 - f) + 14 * f)
        b = int(26 * (1 - f) + 52 * f)
        draw.line([(x, 0), (x, DH)], fill=(r, g, b))
        
    # 2. Add artwork on the right side (from x=850 to 1900)
    if os.path.exists(art_path):
        art_im = Image.open(art_path).convert('RGB')
        # Crop & resize art to fit right side (1050 x 714)
        art_w = 1050
        # Resize maintaining aspect ratio
        scale = max(art_w / float(art_im.width), DH / float(art_im.height))
        nw = int(art_im.width * scale)
        nh = int(art_im.height * scale)
        resized_art = art_im.resize((nw, nh), Image.Resampling.LANCZOS)
        
        # Center crop
        left = (nw - art_w) // 2
        top = (nh - DH) // 2
        cropped_art = resized_art.crop((left, top, left + art_w, top + DH))
        
        # Enhance artwork
        cropped_art = ImageEnhance.Color(cropped_art).enhance(1.15)
        cropped_art = ImageEnhance.Contrast(cropped_art).enhance(1.1)
        
        # Feather mask from left to right (smooth fade into cosmic dark)
        art_mask = Image.new('L', (art_w, DH), 0)
        mdraw = ImageDraw.Draw(art_mask)
        fade_len = 380
        for x in range(art_w):
            if x < fade_len:
                alpha = int(255 * (x / float(fade_len)) ** 1.8)
            else:
                alpha = 255
            mdraw.line([(x, 0), (x, DH)], fill=alpha)
            
        canvas.paste(cropped_art, (DW - art_w, 0), art_mask)
        
    # 3. Add soft gold celestial aura / mandala ring on the seam
    seam_x = 920
    for rad in [450, 400, 350, 300]:
        draw.ellipse([seam_x - rad, (DH // 2) - rad, seam_x + rad, (DH // 2) + rad], outline=(212, 175, 55, 18), width=1)

    # 4. Deep gradient vignette across left 65% so HTML text has maximum readability
    vignette = Image.new('RGBA', (DW, DH), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for x in range(DW):
        if x < 850:
            alpha = 220
        elif x < 1250:
            f = (1250 - x) / 400.0
            alpha = int(220 * f)
        else:
            alpha = 0
        vdraw.line([(x, 0), (x, DH)], fill=(6, 8, 22, alpha))
    
    final_canvas = Image.alpha_composite(canvas.convert('RGBA'), vignette).convert('RGB')
    
    out_p = f'public/images/herobanner/banner_0{idx}.png'
    final_canvas.save(out_p, format='PNG', optimize=True)
    # Also save as ban0*.png for backward compatibility
    final_canvas.save(f'public/images/herobanner/ban0{idx}.png', format='PNG', optimize=True)
    print(f"Generated Desktop Banner {idx}: {out_p}")


def create_mobile_slide(idx, art_path):
    canvas = Image.new('RGB', (MW, MH), (7, 9, 26))
    
    # 1. Artwork at top 60%
    if os.path.exists(art_path):
        art_im = Image.open(art_path).convert('RGB')
        art_h = 320
        scale = max(MW / float(art_im.width), art_h / float(art_im.height))
        nw = int(art_im.width * scale)
        nh = int(art_im.height * scale)
        resized_art = art_im.resize((nw, nh), Image.Resampling.LANCZOS)
        left = (nw - MW) // 2
        top = (nh - art_h) // 2
        cropped_art = resized_art.crop((left, top, left + MW, top + art_h))
        canvas.paste(cropped_art, (0, 0))
        
    # 2. Gradient overlay fading into solid dark at bottom
    fade_overlay = Image.new('RGBA', (MW, MH), (0, 0, 0, 0))
    fdraw = ImageDraw.Draw(fade_overlay)
    for y in range(MH):
        if y < 140:
            alpha = int(120 * (y / 140.0))
        elif y < 280:
            alpha = int(120 + 135 * ((y - 140) / 140.0))
        else:
            alpha = 255
        fdraw.line([(0, y), (MW, y)], fill=(8, 10, 28, alpha))
        
    final_canvas = Image.alpha_composite(canvas.convert('RGBA'), fade_overlay).convert('RGB')
    
    out_p = f'public/images/herobanner/mobile_0{idx}.png'
    final_canvas.save(out_p, format='PNG', optimize=True)
    final_canvas.save(f'public/images/herobanner/mob_0{idx}.png', format='PNG', optimize=True)
    if idx <= 3:
        final_canvas.save(f'public/images/seo/mob_0{idx}.webp', format='WEBP', quality=92)
    print(f"Generated Mobile Banner {idx}: {out_p}")


for idx, art_p in SLIDE_ARTWORKS:
    create_desktop_slide(idx, art_p)
    create_mobile_slide(idx, art_p)

print("All Hero Background Slides Cleanly Generated!")
