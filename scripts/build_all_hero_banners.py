import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

DW, DH = 1900, 714
MW, MH = 480, 516

os.makedirs('/tmp/preview_banners', exist_ok=True)
os.makedirs('public/images/herobanner', exist_ok=True)
os.makedirs('public/images/seo', exist_ok=True)

# ----------------- FONTS -----------------
FONT_TOP = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 38)
FONT_HEAD = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 54)
FONT_HEAD_LG = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 64)
FONT_SUB = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 24)
FONT_PHONE = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 44)
FONT_PHONE_ICON = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Unicode.ttf', 38)
FONT_25_NUM = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 68)
FONT_25_LBL1 = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 16)
FONT_25_LBL2 = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 14)

FONT_BADGE_P = ImageFont.truetype('/System/Library/Fonts/MarkerFelt.ttc', 30, index=0)
FONT_BADGE_S = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 48)
FONT_BADGE_ITALIC = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf', 38)

M_FONT_HEAD = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 26)
M_FONT_PHONE = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 32)
M_FONT_SUB = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 13)

# ----------------- CLEAN ASSETS -----------------
orig1 = Image.open('/tmp/orig_banners/orig_ban01.png').convert('RGBA')

# Bottom smoke crop from orig1 (smooth feather mask)
smoke_crop = orig1.crop((0, 480, DW, DH))
smoke_mask = Image.new('L', smoke_crop.size, 0)
smdraw = ImageDraw.Draw(smoke_mask)
for y in range(smoke_crop.height):
    alpha = int(255 * (y / float(smoke_crop.height)) ** 1.6)
    smdraw.line([(0, y), (DW, y)], fill=alpha)

# Circular USA flag for mobile
flag_crop = orig1.crop((947, 65, 1043, 161))
flag_mask = Image.new('L', flag_crop.size, 0)
ImageDraw.Draw(flag_mask).ellipse([2, 2, flag_crop.width - 2, flag_crop.height - 2], fill=255)
flag_mask = flag_mask.filter(ImageFilter.GaussianBlur(1))


def draw_contact_row(canvas, x_start=120, y_pos=410):
    draw = ImageDraw.Draw(canvas)
    # Yellow circular phone button
    draw.ellipse([x_start, y_pos, x_start + 70, y_pos + 70], fill=(245, 190, 20), outline=(255, 225, 80), width=3)
    draw.text((x_start + 15, y_pos + 8), '☎', fill=(20, 20, 20), font=FONT_PHONE_ICON)
    
    # Phone number text
    draw.text((x_start + 90, y_pos + 12), '+1 929-867-7866', fill=(255, 255, 255), font=FONT_PHONE)
    
    # Divider line
    div_x = x_start + 450
    draw.line([(div_x, y_pos - 5), (div_x, y_pos + 75)], fill=(255, 255, 255, 180), width=2)
    
    # 25 Years Experience
    draw.text((div_x + 20, y_pos - 8), '25', fill=(255, 255, 255), font=FONT_25_NUM)
    draw.text((div_x + 98, y_pos + 14), 'YEARS', fill=(255, 215, 0), font=FONT_25_LBL1)
    draw.text((div_x + 98, y_pos + 38), 'EXPERIENCE', fill=(255, 255, 255), font=FONT_25_LBL2)


def draw_center_badge(canvas, bx1, by1, bx2, by2, badge_type='box'):
    draw = ImageDraw.Draw(canvas)
    if badge_type == 'box':
        draw.rectangle([bx1, by1, bx2, by2], fill=(22, 4, 6, 255))
        draw.rectangle([bx1, by1, bx2, by2], outline=(150, 20, 20, 220), width=1)
        
        bb_p = draw.textbbox((0, 0), 'PSYCHIC', font=FONT_BADGE_P)
        pw = bb_p[2] - bb_p[0]
        draw.text((bx1 + (bx2 - bx1 - pw) // 2, by1 + 6), 'PSYCHIC', fill=(255, 255, 255), font=FONT_BADGE_P)
        
        bb_s = draw.textbbox((0, 0), 'SHANKAR', font=FONT_BADGE_S)
        sw = bb_s[2] - bb_s[0]
        draw.text((bx1 + (bx2 - bx1 - sw) // 2, by1 + 46), 'SHANKAR', fill=(255, 255, 255), font=FONT_BADGE_S)
    else: # red brush
        draw.rounded_rectangle([bx1, by1, bx2, by2], radius=18, fill=(215, 15, 25, 255))
        draw.rounded_rectangle([bx1, by1, bx2, by2], radius=18, outline=(255, 255, 255, 220), width=2)
        
        bb_p = draw.textbbox((0, 0), 'Psychic', font=FONT_BADGE_ITALIC)
        pw = bb_p[2] - bb_p[0]
        draw.text((bx1 + (bx2 - bx1 - pw) // 2, by1 + 6), 'Psychic', fill=(255, 255, 255), font=FONT_BADGE_ITALIC)
        
        bb_s = draw.textbbox((0, 0), 'Shankar', font=FONT_BADGE_ITALIC)
        sw = bb_s[2] - bb_s[0]
        draw.text((bx1 + (bx2 - bx1 - sw) // 2, by1 + 50), 'Shankar', fill=(255, 255, 255), font=FONT_BADGE_ITALIC)


def build_desktop_banner(idx, headlines, subtitle, rx1, badge_pos, badge_type='box'):
    # Base rich ruby-red spiritual background
    canvas = Image.new('RGBA', (DW, DH), (180, 12, 22, 255))
    cdraw = ImageDraw.Draw(canvas)
    for x in range(DW):
        f = x / float(DW)
        r = int(185 - 85 * f)
        g = int(12 - 7 * f)
        b = int(22 - 14 * f)
        cdraw.line([(x, 0), (x, DH)], fill=(r, g, b, 255))

    # Right subject crop from original banner (includes original shield / USA flag naturally)
    orig = Image.open(f'/tmp/orig_banners/orig_ban0{idx}.png').convert('RGBA')
    subject = orig.crop((rx1, 0, DW, DH))
    
    # Feather mask for smooth fade into the red background
    feather_w = 60
    s_mask = Image.new('L', subject.size, 255)
    sdraw = ImageDraw.Draw(s_mask)
    for x in range(feather_w):
        a = int(255 * (x / float(feather_w)))
        sdraw.line([(x, 0), (x, DH)], fill=a)
    
    canvas.paste(subject, (rx1, 0), s_mask)
    
    # Paste Bottom Smoke Clouds
    canvas.paste(smoke_crop, (0, 480), smoke_mask)
    
    # Typography
    draw = ImageDraw.Draw(canvas)
    cur_y = 85
    for color, text in headlines:
        if color == 'yellow':
            draw.text((120, cur_y), text, fill=(255, 215, 0), font=FONT_TOP)
            cur_y += 48
        elif color == 'white_lg':
            draw.text((120, cur_y), text, fill=(255, 255, 255), font=FONT_HEAD_LG)
            cur_y += 75
        else:
            draw.text((120, cur_y), text, fill=(255, 255, 255), font=FONT_HEAD)
            cur_y += 65

    cur_y = max(cur_y + 15, 305)
    draw.text((120, cur_y), subtitle, fill=(255, 235, 235), font=FONT_SUB)
    
    # Contact row
    draw_contact_row(canvas, x_start=120, y_pos=410)
    
    # Center branding badge
    bx1, by1, bx2, by2 = badge_pos
    draw_center_badge(canvas, bx1, by1, bx2, by2, badge_type)
    
    return canvas


# Generate All 6 Desktop Banners
DESKTOP_CONFIGS = [
    (1, [('yellow', 'NO.1 INDIAN BEST'), ('white', 'ASTROLOGER / PSYCHIC'), ('white', 'SPIRITUAL HEALER')],
        'Solve Your All Problems • Consult Our Master Astrologer',
        920, (1250, 272, 1550, 368), 'box'),
    (2, [('yellow', 'SPECIALIST IN'), ('white', 'LOVE PSYCHIC READING'), ('white', 'LOVE & RELATIONSHIP')],
        'Connect With One of Our Expert Advisors • 100% Confidential',
        920, (1130, 270, 1430, 365), 'box'),
    (3, [('white_lg', 'BLACK MAGIC'), ('white_lg', 'REMOVAL')],
        'Astrology Predictions for Love, Life, Relationship & Family',
        920, (1420, 375, 1720, 470), 'box'),
    (4, [('yellow', 'SPECIALIST IN'), ('white', 'HUSBAND & WIFE'), ('white', 'RELATIONSHIP DISPUTE')],
        'Talk to Our Astrologer • Husband Wife Love Problem Solution',
        920, (1070, 310, 1390, 418), 'brush'),
    (5, [('yellow', 'SPECIALIST IN'), ('white', 'SPIRITUAL HEALING'), ('white', 'NEGATIVE ENERGY REMOVAL')],
        'Talk to Our Astrologer • Bad Luck & Negative Energy Solutions',
        920, (1360, 385, 1660, 480), 'box'),
    (6, [('white', 'LOVE PSYCHIC READER'), ('white', 'LOVE READING SPECIALIST'), ('white', 'SPIRITUAL HEALER')],
        'Solve Your All Problems • Consult Our Master Astrologer',
        920, (1080, 435, 1420, 535), 'box'),
]

print("Generating 6 Desktop Hero Banners...")
for idx, heads, sub, rx1, bpos, btype in DESKTOP_CONFIGS:
    banner = build_desktop_banner(idx, heads, sub, rx1, bpos, btype)
    # Save previews
    banner.save(f'/tmp/preview_banners/preview_ban0{idx}.png', optimize=True)
    # Save to public/images/herobanner
    banner.save(f'public/images/herobanner/ban0{idx}.png', optimize=True)
    print(f"Generated Desktop Banner {idx}")


# Generate All 6 Mobile Banners
MOBILE_CONFIGS = [
    (1, ["ASTROLOGER / PSYCHIC", "SPIRITUAL HEALER"]),
    (2, ["LOVE PSYCHIC READING", "SPECIALIST"]),
    (3, ["BLACK MAGIC REMOVAL", "SPECIALIST"]),
    (4, ["HUSBAND & WIFE", "RELATIONSHIP PROBLEM"]),
    (5, ["SPIRITUAL HEALER", "SPECIALIST"]),
    (6, ["LOVE PSYCHIC READER", "LOVE READING SPECIALIST"]),
]

print("Generating 6 Mobile Hero Banners...")
for idx, lines in MOBILE_CONFIGS:
    orig_mob = Image.open(f'/tmp/orig_banners/orig_mob_0{idx}.png').convert('RGBA')
    top_crop = orig_mob.crop((0, 0, MW, 295))
    
    mob_canvas = Image.new('RGBA', (MW, MH), (255, 255, 255, 255))
    mob_canvas.paste(top_crop, (0, 0))
    
    # White Card at Bottom with red arch
    card = Image.new('RGBA', (MW, MH - 280), (255, 255, 255, 255))
    cdraw = ImageDraw.Draw(card)
    cdraw.line([(0, 0), (MW, 0)], fill=(230, 20, 30, 255), width=3)
    
    cur_y = 22
    for l in lines:
        bb = cdraw.textbbox((0, 0), l, font=M_FONT_HEAD)
        lw = bb[2] - bb[0]
        cdraw.text(((MW - lw) // 2, cur_y), l, fill=(15, 15, 25), font=M_FONT_HEAD)
        cur_y += 32
        
    py = 100
    cdraw.ellipse([35, py, 90, py + 55], fill=(245, 190, 20), outline=(255, 225, 80), width=2)
    cdraw.text((47, py + 7), '☎', fill=(20, 20, 20), font=FONT_PHONE_ICON)
    
    cdraw.text((105, py + 5), '+1 929-867-7866', fill=(40, 10, 50), font=M_FONT_PHONE)
    cdraw.text((108, py + 42), 'WHATSAPP 24/7 SUPPORT', fill=(15, 15, 25), font=M_FONT_SUB)
    
    # USA flag circle with circular mask
    flag_small = flag_crop.resize((48, 48), Image.Resampling.LANCZOS)
    fmask_small = flag_mask.resize((48, 48), Image.Resampling.LANCZOS)
    card.paste(flag_small, (400, py + 4), fmask_small)
    cdraw.text((408, py + 56), 'USA', fill=(15, 15, 25), font=M_FONT_SUB)
    
    mob_canvas.paste(card, (0, 280))
    
    mob_canvas.save(f'/tmp/preview_banners/preview_mob_0{idx}.png', optimize=True)
    mob_canvas.save(f'public/images/herobanner/mob_0{idx}.png', optimize=True)
    if idx <= 3:
        mob_canvas.convert('RGB').save(f'public/images/seo/mob_0{idx}.webp', format='WEBP', quality=95)
    print(f"Generated Mobile Banner {idx}")

print("ALL HERO BANNERS READY!")
