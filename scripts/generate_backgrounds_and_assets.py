import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

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

# 1. Generate video_section.webp (1600 x 669)
def gen_video_section():
    w, h = 1600, 669
    img = Image.new('RGB', (w, h), (8, 6, 22))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    # Gradient
    for y in range(h):
        f = abs(y - cy) / float(cy)
        r = int(32 * (1 - f) + 7 * f)
        g = int(14 * (1 - f) + 5 * f)
        b = int(65 * (1 - f) + 18 * f)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
        
    # Stars
    rng = random.Random(101)
    for _ in range(160):
        sx = rng.randint(20, w - 20)
        sy = rng.randint(20, h - 20)
        sr = rng.choice([1, 1, 2, 2, 3])
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 240, 200))
        if sr == 3 and rng.random() > 0.5:
            draw.line([sx - 6, sy, sx + 6, sy], fill=(255, 255, 230), width=1)
            draw.line([sx, sy - 6, sx, sy + 6], fill=(255, 255, 230), width=1)
            
    # Concentric Mandalas in background
    for rad in [280, 240, 200, 160, 120]:
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=(212, 175, 55, 50), width=2)
    for i in range(24):
        ang = i * (2 * math.pi / 24)
        x1 = cx + 200 * math.cos(ang)
        y1 = cy + 200 * math.sin(ang)
        x2 = cx + 240 * math.cos(ang)
        y2 = cy + 240 * math.sin(ang)
        draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 70), width=2)
        
    # Central Glowing Play Medallion
    p_rad = 54
    # Halo glow
    for gr in range(p_rad + 30, p_rad, -2):
        draw.ellipse([cx - gr, cy - gr, cx + gr, cy + gr], outline=(255, 215, 0, 30), width=2)
    # Gold circle
    draw.ellipse([cx - p_rad, cy - p_rad, cx + p_rad, cy + p_rad], fill=(212, 175, 55), outline=(255, 245, 170), width=4)
    # Inner dark disc
    draw.ellipse([cx - p_rad + 6, cy - p_rad + 6, cx + p_rad - 6, cy + p_rad - 6], fill=(25, 15, 45))
    # Play Triangle
    play_tri = [(cx - 14, cy - 22), (cx + 26, cy), (cx - 14, cy + 22)]
    draw.polygon(play_tri, fill=(255, 220, 80))
    
    # Text Banner
    f_title = get_font(38, bold=True)
    t1 = "WATCH SPIRITUAL CONSULTATION PREVIEW"
    t1_bb = f_title.getbbox(t1)
    t1_w = t1_bb[2] - t1_bb[0]
    draw.text(((w - t1_w) // 2, cy + 90), t1, fill=(255, 255, 255), font=f_title)
    
    f_sub = get_font(24, bold=True)
    t2 = "✦ PSYCHIC SHANKAR - 100% CONFIDENTIAL & ACCURATE GUIDANCE ✦"
    t2_bb = f_sub.getbbox(t2)
    t2_w = t2_bb[2] - t2_bb[0]
    draw.text(((w - t2_w) // 2, cy + 150), t2, fill=(255, 215, 0), font=f_sub)
    
    f_sub2 = get_font(20, bold=False)
    t3 = "Experience Authentic Vedic Wisdom • Love Back • Black Magic Removal • 24/7 Available"
    t3_bb = f_sub2.getbbox(t3)
    t3_w = t3_bb[2] - t3_bb[0]
    draw.text(((w - t3_w) // 2, cy + 195), t3, fill=(220, 220, 240), font=f_sub2)
    
    # Save
    out_path = 'public/images/seo/video_section.webp'
    img.save(out_path, format='WEBP', quality=92)
    print(f"Saved: {out_path}")

# 2. Generate parallax-bg8-.webp (1200 x 854)
def gen_parallax_bg():
    w, h = 1200, 854
    img = Image.new('RGB', (w, h), (6, 5, 18))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    # Cosmic radial gradient
    max_r = int(math.sqrt(cx**2 + cy**2))
    for r in range(max_r, 0, -8):
        f = (r / float(max_r)) ** 1.2
        red = int(35 * (1 - f) + 5 * f)
        green = int(15 * (1 - f) + 4 * f)
        blue = int(68 * (1 - f) + 15 * f)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue))
        
    # Starfield
    rng = random.Random(202)
    for _ in range(250):
        sx = rng.randint(20, w - 20)
        sy = rng.randint(20, h - 20)
        sr = rng.choice([1, 1, 1, 2, 2, 3])
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 245, 210))
        if sr == 3 and rng.random() > 0.5:
            draw.line([sx - 5, sy, sx + 5, sy], fill=(255, 255, 230), width=1)
            draw.line([sx, sy - 5, sx, sy + 5], fill=(255, 255, 230), width=1)
            
    # Vedic Zodiac Kundali / Horoscope Wheel in center
    for rad in [380, 350, 320, 280, 240, 180, 120, 60]:
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=(212, 175, 55, 60), width=2)
        
    # 12 Zodiac House Rays
    for i in range(12):
        ang = i * (2 * math.pi / 12)
        x1 = cx + 60 * math.cos(ang)
        y1 = cy + 60 * math.sin(ang)
        x2 = cx + 380 * math.cos(ang)
        y2 = cy + 380 * math.sin(ang)
        draw.line([x1, y1, x2, y2], fill=(255, 215, 0, 80), width=2)
        
        # Astrological house symbols / stars
        mid_ang = ang + (math.pi / 12)
        hx = cx + 350 * math.cos(mid_ang)
        hy = cy + 350 * math.sin(mid_ang)
        draw_star(draw, hx, hy, 12, 5, 5, fill=(255, 225, 90, 180))
        
    # Center Sun
    draw_star(draw, cx, cy, 45, 18, 12, fill=(255, 215, 0, 240), outline=(255, 255, 255, 255))
    draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=(255, 245, 160))
    
    out_path = 'public/images/seo/parallax-bg8-.webp'
    img.save(out_path, format='WEBP', quality=92)
    print(f"Saved: {out_path}")

# 3. Generate our-service-bg-min-.webp (1911 x 684) and our-service-bg-mob.png (680 x 874)
def gen_service_backgrounds():
    # Desktop
    w, h = 1911, 684
    img = Image.new('RGB', (w, h), (8, 6, 20))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    for y in range(h):
        f = (y / float(h))
        r = int(22 * (1 - f) + 8 * f)
        g = int(10 * (1 - f) + 5 * f)
        b = int(48 * (1 - f) + 18 * f)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    # Soft mandala arcs at corners
    for ox, oy in [(0, 0), (w, 0), (0, h), (w, h), (cx, cy)]:
        for rad in [150, 250, 350]:
            draw.ellipse([ox - rad, oy - rad, ox + rad, oy + rad], outline=(212, 175, 55, 25), width=2)
    out_path = 'public/images/seo/our-service-bg-min-.webp'
    img.save(out_path, format='WEBP', quality=90)
    print(f"Saved: {out_path}")
    
    # Mobile
    mw, mh = 680, 874
    m_img = Image.new('RGB', (mw, mh), (8, 6, 20))
    mdraw = ImageDraw.Draw(m_img)
    mcx, mcy = mw // 2, mh // 2
    for y in range(mh):
        f = (y / float(mh))
        r = int(25 * (1 - f) + 7 * f)
        g = int(12 * (1 - f) + 4 * f)
        b = int(52 * (1 - f) + 16 * f)
        mdraw.line([(0, y), (mw, y)], fill=(r, g, b))
    for rad in [140, 220, 300]:
        mdraw.ellipse([mcx - rad, mcy - rad, mcx + rad, mcy + rad], outline=(212, 175, 55, 30), width=2)
    m_out_path = 'public/images/seo/our-service-bg-mob.png'
    m_img.save(m_out_path, format='PNG', optimize=True)
    print(f"Saved: {m_out_path}")

# 4. Generate google_cus_review_btn.webp (186 x 56) and google_cus_review_btn_mob.png (77 x 79)
def gen_google_review_badges():
    # Desktop 186x56
    w, h = 372, 112
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # White rounded pill
    draw.rounded_rectangle([4, 4, w - 4, h - 4], radius=24, fill=(255, 255, 255, 255), outline=(220, 220, 230, 255), width=2)
    
    # Google 'G' stylized logo on left
    gx, gy = 50, 56
    draw.ellipse([gx - 32, gy - 32, gx + 32, gy + 32], outline=(66, 133, 244, 255), width=10) # Blue
    draw.rectangle([gx, gy - 7, gx + 28, gy + 7], fill=(66, 133, 244, 255))
    
    # 5 Gold Stars
    f_stars = get_font(26, bold=True)
    draw.text((100, 24), "★★★★★", fill=(250, 187, 0, 255), font=f_stars)
    
    # Text
    f_txt = get_font(22, bold=True)
    draw.text((100, 60), "4.9 / 5.0  (1,850+)", fill=(60, 64, 67, 255), font=f_txt)
    
    out_img = img.resize((186, 56), Image.Resampling.LANCZOS)
    out_path = 'public/images/seo/google_cus_review_btn.webp'
    out_img.save(out_path, format='WEBP', quality=95)
    print(f"Saved: {out_path}")
    
    # Mobile 77x79
    mw, mh = 154, 158
    m_img = Image.new('RGBA', (mw, mh), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(m_img)
    mdraw.rounded_rectangle([4, 4, mw - 4, mh - 4], radius=24, fill=(255, 255, 255, 255), outline=(220, 220, 230, 255), width=2)
    
    # G in mobile center
    mgx, mgy = 77, 50
    mdraw.ellipse([mgx - 26, mgy - 26, mgx + 26, mgy + 26], outline=(66, 133, 244, 255), width=8)
    mdraw.rectangle([mgx, mgy - 6, mgx + 22, mgy + 6], fill=(66, 133, 244, 255))
    
    # Stars & 4.9
    mf_s = get_font(20, bold=True)
    mdraw.text((36, 88), "★★★★★", fill=(250, 187, 0, 255), font=mf_s)
    
    mf_t = get_font(22, bold=True)
    mdraw.text((45, 116), "4.9 ★", fill=(60, 64, 67, 255), font=mf_t)
    
    m_out = m_img.resize((77, 79), Image.Resampling.LANCZOS)
    m_path = 'public/images/google_cus_review_btn_mob.png'
    m_out.save(m_path, format='PNG', optimize=True)
    print(f"Saved: {m_path}")

# 5. Generate tit_why.png (1245 x 74)
def gen_tit_why():
    w, h = 1245, 74
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    # Background ribbon
    draw.rounded_rectangle([20, 6, w - 20, h - 6], radius=18, fill=(18, 12, 38, 240), outline=(212, 175, 55, 255), width=2)
    
    # Decorative filigree ends
    draw.line([40, cy, 180, cy], fill=(255, 215, 0, 200), width=2)
    draw_star(draw, 190, cy, 12, 5, 4, fill=(255, 215, 0, 255))
    
    draw.line([w - 40, cy, w - 180, cy], fill=(255, 215, 0, 200), width=2)
    draw_star(draw, w - 190, cy, 12, 5, 4, fill=(255, 215, 0, 255))
    
    # Title Text
    f = get_font(30, bold=True)
    txt = "✦ WHY CHOOSE PSYCHIC SHANKAR - MASTER VEDIC ASTROLOGER ✦"
    bb = f.getbbox(txt)
    tw = bb[2] - bb[0]
    draw.text(((w - tw) // 2, cy - 18), txt, fill=(255, 220, 100, 255), font=f)
    
    out_path = 'public/images/tit_why.png'
    img.save(out_path, format='PNG', optimize=True)
    print(f"Saved: {out_path}")

# 6. Generate btn_premium_astro.png (200 x 108)
def gen_btn_premium():
    w, h = 400, 216
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    draw.rounded_rectangle([8, 8, w - 8, h - 8], radius=20, fill=(22, 14, 45, 255), outline=(212, 175, 55, 255), width=4)
    draw.rounded_rectangle([14, 14, w - 14, h - 14], radius=16, outline=(255, 235, 140, 120), width=1)
    
    draw_star(draw, cx, 48, 22, 9, 8, fill=(255, 215, 0, 255))
    
    f1 = get_font(28, bold=True)
    t1 = "PREMIUM ASTROLOGY"
    b1 = f1.getbbox(t1)
    draw.text(((w - (b1[2] - b1[0])) // 2, 85), t1, fill=(255, 255, 255, 255), font=f1)
    
    f2 = get_font(22, bold=True)
    t2 = "✦ 100% VERIFIED ✦"
    b2 = f2.getbbox(t2)
    draw.text(((w - (b2[2] - b2[0])) // 2, 135), t2, fill=(255, 215, 0, 255), font=f2)
    
    out_img = img.resize((200, 108), Image.Resampling.LANCZOS)
    out_path = 'public/images/btn_premium_astro.png'
    out_img.save(out_path, format='PNG', optimize=True)
    print(f"Saved: {out_path}")

# 7. Generate btn_usa_location.png (317 x 77)
def gen_btn_usa_location():
    w, h = 634, 154
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    draw.rounded_rectangle([8, 8, w - 8, h - 8], radius=24, fill=(16, 22, 60, 255), outline=(212, 175, 55, 255), width=4)
    
    draw_star(draw, 60, cy, 26, 11, 5, fill=(255, 215, 0, 255))
    draw_star(draw, w - 60, cy, 26, 11, 5, fill=(255, 215, 0, 255))
    
    f1 = get_font(30, bold=True)
    t1 = "SERVING ALL 50 US STATES"
    b1 = f1.getbbox(t1)
    draw.text(((w - (b1[2] - b1[0])) // 2, 35), t1, fill=(255, 255, 255, 255), font=f1)
    
    f2 = get_font(22, bold=False)
    t2 = "✦ Available 24/7 By Call & Online ✦"
    b2 = f2.getbbox(t2)
    draw.text(((w - (b2[2] - b2[0])) // 2, 85), t2, fill=(255, 220, 100, 255), font=f2)
    
    out_img = img.resize((317, 77), Image.Resampling.LANCZOS)
    out_path = 'public/images/btn_usa_location.png'
    out_img.save(out_path, format='PNG', optimize=True)
    print(f"Saved: {out_path}")

# 8. Generate icon_phone_new.png (265 x 44)
def gen_icon_phone():
    w, h = 530, 88
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    draw.rounded_rectangle([4, 4, w - 4, h - 4], radius=22, fill=(212, 175, 55, 255), outline=(255, 245, 180, 255), width=3)
    
    # Phone symbol
    draw.arc([40, 22, 70, 52], start=40, end=140, fill=(20, 10, 35, 255), width=8)
    draw.ellipse([34, 20, 48, 34], fill=(20, 10, 35, 255))
    draw.ellipse([62, 20, 76, 34], fill=(20, 10, 35, 255))
    
    f = get_font(32, bold=True)
    txt = "+1 (209) 597-1284"
    draw.text((95, 24), txt, fill=(20, 10, 35, 255), font=f)
    
    out_img = img.resize((265, 44), Image.Resampling.LANCZOS)
    out_path = 'public/images/icon_phone_new.png'
    out_img.save(out_path, format='PNG', optimize=True)
    print(f"Saved: {out_path}")

# 9. Generate wel_texg1.webp (976 x 320)
def gen_wel_texg1():
    w, h = 976, 320
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = w // 2, h // 2
    
    draw.rounded_rectangle([10, 10, w - 10, h - 10], radius=24, fill=(18, 12, 38, 235), outline=(212, 175, 55, 255), width=3)
    draw.rounded_rectangle([18, 18, w - 18, h - 18], radius=18, outline=(255, 235, 140, 100), width=1)
    
    f1 = get_font(26, bold=True)
    t1 = "✦ SACRED VEDIC ASTROLOGY & SPIRITUAL HEALING ✦"
    b1 = f1.getbbox(t1)
    draw.text(((w - (b1[2] - b1[0])) // 2, 45), t1, fill=(255, 215, 0, 255), font=f1)
    
    f2 = get_font(46, bold=True)
    t2 = "WELCOME TO PSYCHIC SHANKAR"
    b2 = f2.getbbox(t2)
    draw.text(((w - (b2[2] - b2[0])) // 2, 95), t2, fill=(255, 255, 255, 255), font=f2)
    
    f3 = get_font(26, bold=False)
    t3 = "World Renowned Indian Astrologer, Psychic Reader & Spiritual Guide"
    b3 = f3.getbbox(t3)
    draw.text(((w - (b3[2] - b3[0])) // 2, 170), t3, fill=(255, 220, 120, 255), font=f3)
    
    f4 = get_font(22, bold=False)
    t4 = "Restoring Love, Marital Peace, Family Unity, and Prosperity Across USA"
    b4 = f4.getbbox(t4)
    draw.text(((w - (b4[2] - b4[0])) // 2, 225), t4, fill=(220, 220, 240, 255), font=f4)
    
    out_path = 'public/images/seo/wel_texg1.webp'
    img.save(out_path, format='WEBP', quality=95)
    print(f"Saved: {out_path}")

# 10. Generate mob_01.webp, mob_02.webp, mob_03.webp (480 x 516)
def gen_mob_slides():
    for i in range(1, 4):
        src_png = f'public/images/herobanner/mob_0{i}.png'
        if os.path.exists(src_png):
            im = Image.open(src_png)
            out_webp = f'public/images/seo/mob_0{i}.webp'
            im.save(out_webp, format='WEBP', quality=92)
            print(f"Saved: {out_webp} (from {src_png})")

if __name__ == '__main__':
    gen_video_section()
    gen_parallax_bg()
    gen_service_backgrounds()
    gen_google_review_badges()
    gen_tit_why()
    gen_btn_premium()
    gen_btn_usa_location()
    gen_icon_phone()
    gen_wel_texg1()
    gen_mob_slides()
