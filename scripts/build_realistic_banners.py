import urllib.request
import io
import os
from PIL import Image, ImageDraw

BANNER_CONFIGS = [
    (1, "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1920&q=85"), # Golden temple night
    (2, "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&q=85"), # Romantic golden love atmosphere
    (3, "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1920&q=85"), # Celestial galaxy & stars
    (4, "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1920&q=85"), # Sacred protection fire
    (5, "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=1920&q=85"), # Crystal ball & psychic foresight
    (6, "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=85"), # Loving couple reconciled
]

DW, DH = 1900, 714
MW, MH = 480, 516

os.makedirs('public/images/herobanner', exist_ok=True)
os.makedirs('public/images/seo', exist_ok=True)

for idx, url in BANNER_CONFIGS:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    content = urllib.request.urlopen(req, timeout=12).read()
    raw = Image.open(io.BytesIO(content)).convert('RGBA')
    
    # 1. Desktop Banner (1900 x 714)
    # Scale to fill height 714
    scale = max(DW / float(raw.width), DH / float(raw.height))
    nw, nh = int(raw.width * scale), int(raw.height * scale)
    scaled = raw.resize((nw, nh), Image.Resampling.LANCZOS)
    
    # Position towards the right to keep focus area visible on right side
    crop_x = nw - DW
    crop_y = (nh - DH) // 2
    banner = scaled.crop((crop_x, crop_y, crop_x + DW, crop_y + DH))
    
    # Dark gradient overlay on left for typography readability
    gradient = Image.new('RGBA', (DW, DH), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(gradient)
    for x in range(DW):
        if x < 700:
            alpha = int(245 * (1.0 - (x / 700.0) ** 1.6))
        else:
            alpha = 0
        gdraw.line([(x, 0), (x, DH)], fill=(8, 12, 28, alpha))
        
    banner.alpha_composite(gradient)
    
    ban_path = f'public/images/herobanner/ban0{idx}.png'
    banner.save(ban_path, format='PNG', optimize=True)
    print(f"Saved: {ban_path}")
    
    # 2. Mobile Banner (480 x 516)
    m_scale = max(MW / float(raw.width), MH / float(raw.height))
    mnw, mnh = int(raw.width * m_scale), int(raw.height * m_scale)
    m_scaled = raw.resize((mnw, mnh), Image.Resampling.LANCZOS)
    m_crop_x = (mnw - MW) // 2
    m_crop_y = (mnh - MH) // 2
    mob_banner = m_scaled.crop((m_crop_x, m_crop_y, m_crop_x + MW, m_crop_y + MH))
    
    # Subtle dark vignette
    m_grad = Image.new('RGBA', (MW, MH), (0, 0, 0, 0))
    mgdraw = ImageDraw.Draw(m_grad)
    for y in range(MH):
        alpha = int(140 * (y / float(MH)) ** 1.4)
        mgdraw.line([(0, y), (MW, y)], fill=(8, 12, 28, alpha))
    mob_banner.alpha_composite(m_grad)
    
    mob_path = f'public/images/herobanner/mob_0{idx}.png'
    mob_banner.save(mob_path, format='PNG', optimize=True)
    print(f"Saved: {mob_path}")
    
    # Also save as webp for seo
    if idx <= 3:
        seo_webp = f'public/images/seo/mob_0{idx}.webp'
        mob_banner.convert('RGB').save(seo_webp, format='WEBP', quality=92)
        print(f"Saved: {seo_webp}")
