import os
import math
import urllib.request
import io
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

# Super-sampled canvas: 1600 x 1600 downscaled to 800 x 800
SW, SH = 1600, 1600
FINAL_SIZE = (800, 800)
scx, scy = SW // 2, SH // 2

# High-resolution fonts for 1600x1600 canvas
FONT_TITLE = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 88)
FONT_PSYCHIC = ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf', 70)
FONT_SHANKAR = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 68)

def render_ultra_badge(title_lines, photo_source, out_filename):
    # 1. Load photo
    if photo_source.startswith("LOCAL:"):
        raw_im = Image.open(photo_source.replace("LOCAL:", "")).convert('RGBA')
    else:
        req = urllib.request.Request(photo_source, headers={'User-Agent': 'Mozilla/5.0'})
        raw_im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=10).read())).convert('RGBA')
        
    # Crop square center
    min_dim = min(raw_im.size)
    left = (raw_im.width - min_dim) // 2
    top = (raw_im.height - min_dim) // 2
    crop_im = raw_im.crop((left, top, left + min_dim, top + min_dim)).resize((1420, 1420), Image.Resampling.LANCZOS)
    
    # Color grade photo
    crop_im = ImageEnhance.Color(crop_im).enhance(1.18)
    crop_im = ImageEnhance.Contrast(crop_im).enhance(1.12)
    crop_im = ImageEnhance.Sharpness(crop_im).enhance(1.2)
    
    # High-res canvas
    canvas = Image.new('RGBA', (SW, SH), (0, 0, 0, 0))
    
    # 2. Circular Photo Mask (Radius 708 px, diameter 1416 px)
    photo_radius = 708
    mask = Image.new('L', (1420, 1420), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.ellipse([2, 2, 1418, 1418], fill=255)
    
    # Paste photo centered
    canvas.paste(crop_im, (90, 90), mask)
    
    # Vignette darkening at bottom of photo so text is punchy
    vignette = Image.new('RGBA', (SW, SH), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for y in range(800, 1500):
        alpha = int(180 * ((y - 800) / 700.0) ** 1.5)
        vdraw.line([(0, y), (SW, y)], fill=(0, 0, 0, alpha))
    v_mask = Image.new('L', (SW, SH), 0)
    ImageDraw.Draw(v_mask).ellipse([scx - photo_radius, scy - photo_radius, scx + photo_radius, scy + photo_radius], fill=255)
    canvas.paste(vignette, (0, 0), v_mask)
    
    draw = ImageDraw.Draw(canvas)
    
    # 3. Outer Red Gradient Ring (Radius 788 to 710)
    outer_r = 788
    inner_r = 710
    ring_thick = outer_r - inner_r
    for r in range(outer_r, inner_r, -2):
        f = (outer_r - r) / float(ring_thick)
        # Rich ruby red to deep crimson gradient
        red = int(225 * (1 - f) + 175 * f)
        green = int(30 * (1 - f) + 12 * f)
        blue = int(35 * (1 - f) + 18 * f)
        draw.ellipse([scx - r, scy - r, scx + r, scy + r], outline=(red, green, blue, 255), width=3)
        
    # Gold bevel trim rings
    draw.ellipse([scx - outer_r, scy - outer_r, scx + outer_r, scy + outer_r], outline=(180, 20, 20, 255), width=5)
    draw.ellipse([scx - inner_r, scy - inner_r, scx + inner_r, scy + inner_r], outline=(140, 10, 10, 255), width=4)
    draw.ellipse([scx - outer_r + 2, scy - outer_r + 2, scx + outer_r - 2, scy + outer_r - 2], outline=(255, 215, 120, 160), width=2)
    draw.ellipse([scx - inner_r - 2, scy - inner_r - 2, scx + inner_r + 2, scy + inner_r + 2], outline=(255, 215, 120, 160), width=2)
    
    # 4. White Dotted Ring at radius 749 (68 round dots)
    num_dots = 72
    dot_radius = 749
    for i in range(num_dots):
        ang = i * (2 * math.pi / num_dots)
        dx = scx + dot_radius * math.cos(ang)
        dy = scy + dot_radius * math.sin(ang)
        # Glowing dot with soft halo
        draw.ellipse([dx - 11, dy - 11, dx + 11, dy + 11], fill=(255, 255, 255, 255))
        draw.ellipse([dx - 13, dy - 13, dx + 13, dy + 13], outline=(255, 230, 150, 120), width=2)
        
    # 5. Service Title Rendering (White Impact with smooth drop shadow + black stroke)
    line_h = 105
    total_h = len(title_lines) * line_h
    start_y = 1110 - total_h
    
    for idx, line in enumerate(title_lines):
        line = line.strip()
        bbox = FONT_TITLE.getbbox(line)
        tw = bbox[2] - bbox[0]
        tx = (SW - tw) // 2
        ty = start_y + idx * line_h
        
        # Heavy smooth drop-shadow
        for ox in range(-8, 9):
            for oy in range(-8, 9):
                if ox != 0 or oy != 0:
                    draw.text((tx + ox, ty + oy), line, fill=(0, 0, 0, 255), font=FONT_TITLE)
        # Pure crisp white text
        draw.text((tx, ty), line, fill=(255, 255, 255, 255), font=FONT_TITLE)
        
    # 6. Bottom Badges
    # Red "PSYCHIC" Badge
    py1 = 1260
    py2 = 1370
    pw_half = 260
    draw.rounded_rectangle([scx - pw_half, py1, scx + pw_half, py2], radius=24, fill=(225, 25, 30, 255), outline=(255, 255, 255, 230), width=4)
    # Bevel highlight
    draw.rounded_rectangle([scx - pw_half + 4, py1 + 4, scx + pw_half - 4, py2 - 4], radius=20, outline=(255, 180, 180, 120), width=2)
    p_box = FONT_PSYCHIC.getbbox("PSYCHIC")
    pw = p_box[2] - p_box[0]
    draw.text((scx - pw // 2, py1 + 16), "PSYCHIC", fill=(255, 255, 255, 255), font=FONT_PSYCHIC)
    
    # Black "SHANKAR" Badge
    sy1 = 1385
    sy2 = 1495
    sw_half = 300
    # Soft drop shadow for pill
    draw.rounded_rectangle([scx - sw_half - 4, sy1 - 4, scx + sw_half + 4, sy2 + 4], radius=32, fill=(0, 0, 0, 180))
    # Solid black pill
    draw.rounded_rectangle([scx - sw_half, sy1, scx + sw_half, sy2], radius=28, fill=(12, 12, 14, 255), outline=(255, 255, 255, 240), width=3)
    s_box = FONT_SHANKAR.getbbox("SHANKAR")
    sw = s_box[2] - s_box[0]
    draw.text((scx - sw // 2, sy1 + 18), "SHANKAR", fill=(255, 255, 255, 255), font=FONT_SHANKAR)
    
    # 7. Super-sample down to 800 x 800 with LANCZOS
    final_badge = canvas.resize(FINAL_SIZE, Image.Resampling.LANCZOS)
    final_badge.save(out_filename, format='PNG', optimize=True)
    print(f"Rendered Ultra Badge: {out_filename}")

if __name__ == '__main__':
    os.makedirs('/tmp/ultra_test', exist_ok=True)
    render_ultra_badge(["GET YOUR EX", "LOVE BACK"], "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&q=85", "/tmp/ultra_test/test_badge_1.png")

