import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

def process_services():
    os.makedirs('public/images/our_service_img', exist_ok=True)
    font_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    font = ImageFont.truetype(font_path, 19)
    txt = "SHANKAR"
    bbox = font.getbbox(txt)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    # Pill coordinates: exact match from reference analysis
    pill_box = [123, 348, 276, 376]
    tx = 200 - tw // 2 - bbox[0]
    ty = 348 + (28 - th) // 2 - bbox[1]

    for i in range(1, 21):
        # Extract original image from commit 6ae6cc1 if not in /tmp
        orig_path = f'/tmp/orig_{i}.png'
        if not os.path.exists(orig_path):
            cmd = f'git show 6ae6cc1:public/images/our_service_img/pro_im_{i}.png'
            data = subprocess.check_output(cmd, shell=True)
            with open(orig_path, 'wb') as f:
                f.write(data)
                
        im = Image.open(orig_path).convert('RGBA')
        draw = ImageDraw.Draw(im)
        
        # Redraw smooth black rounded pill to cleanly replace "ARJUN KRISHNA" with "SHANKAR"
        draw.rounded_rectangle(pill_box, radius=12, fill=(0, 0, 0, 255))
        
        # Render SHANKAR in pure white bold text
        draw.text((tx, ty), txt, fill=(255, 255, 255, 255), font=font)
        
        out_path = f'public/images/our_service_img/pro_im_{i}.png'
        im.save(out_path, format='PNG', optimize=True)
        print(f"Service {i} updated: {out_path}")

if __name__ == '__main__':
    process_services()
