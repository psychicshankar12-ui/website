import math
import os
from PIL import Image, ImageDraw, ImageFont

def draw_star(draw, x, y, r_out, r_in):
    angle = math.pi / 5
    pts = []
    for i in range(10):
        r = r_out if i % 2 == 0 else r_in
        a = i * angle - math.pi / 2
        pts.append((x + r * math.cos(a), y + r * math.sin(a)))
    draw.polygon(pts, fill=(251, 188, 4, 255), outline=(225, 160, 0, 255))

def generate_desktop_badge():
    # 2x dimensions: 372 x 112 -> output 186 x 56
    W, H = 372, 112
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # White rounded card
    draw.rounded_rectangle([4, 4, W - 4, H - 4], radius=24, fill=(255, 255, 255, 255), outline=(218, 220, 224, 255), width=2)

    # Google "G" 4-color logo
    gx, gy = 52, 56
    g_rad = 30
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=215, end=335, fill=(234, 67, 53, 255), width=10) # Red
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=125, end=225, fill=(251, 188, 5, 255), width=10) # Yellow
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=35, end=135, fill=(52, 168, 83, 255), width=10)  # Green
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=0, end=45, fill=(66, 133, 244, 255), width=10)    # Blue
    draw.rectangle([gx, gy - 5, gx + 26, gy + 5], fill=(66, 133, 244, 255))
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=315, end=360, fill=(66, 133, 244, 255), width=10)

    # 5 Solid Gold Stars
    star_y = 35
    for sx in [116, 146, 176, 206, 236]:
        draw_star(draw, sx, star_y, 13, 6)

    # Typography
    font_bold = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 24)
    draw.text((106, 62), "4.9", fill=(32, 33, 36, 255), font=font_bold)

    font_reg = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 20)
    draw.text((148, 65), "(1,850+ Reviews)", fill=(95, 99, 104, 255), font=font_reg)

    out_img = img.resize((186, 56), Image.Resampling.LANCZOS)
    
    os.makedirs('public/images/seo', exist_ok=True)
    out_path_webp = 'public/images/seo/google_cus_review_btn.webp'
    out_img.save(out_path_webp, format='WEBP', quality=95)
    print(f"Saved: {out_path_webp}")

def generate_mobile_badge():
    # 2x dimensions: 154 x 158 -> output 77 x 79
    W, H = 154, 158
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # White card
    draw.rounded_rectangle([4, 4, W - 4, H - 4], radius=22, fill=(255, 255, 255, 255), outline=(218, 220, 224, 255), width=2)

    # Google G
    gx, gy = 77, 44
    g_rad = 24
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=215, end=335, fill=(234, 67, 53, 255), width=8) # Red
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=125, end=225, fill=(251, 188, 5, 255), width=8) # Yellow
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=35, end=135, fill=(52, 168, 83, 255), width=8)  # Green
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=0, end=45, fill=(66, 133, 244, 255), width=8)    # Blue
    draw.rectangle([gx, gy - 4, gx + 20, gy + 4], fill=(66, 133, 244, 255))
    draw.arc([gx - g_rad, gy - g_rad, gx + g_rad, gy + g_rad], start=315, end=360, fill=(66, 133, 244, 255), width=8)

    # 5 Stars in line
    star_y = 86
    for sx in [35, 56, 77, 98, 119]:
        draw_star(draw, sx, star_y, 9, 4)

    # 4.9 ★ Rating
    font_mob = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 24)
    txt = "4.9 ★"
    b = font_mob.getbbox(txt)
    tw = b[2] - b[0]
    draw.text(((W - tw) // 2, 114), txt, fill=(32, 33, 36, 255), font=font_mob)

    out_img = img.resize((77, 79), Image.Resampling.LANCZOS)
    out_path = 'public/images/google_cus_review_btn_mob.png'
    out_img.save(out_path, format='PNG', optimize=True)
    print(f"Saved: {out_path}")

if __name__ == '__main__':
    generate_desktop_badge()
    generate_mobile_badge()
