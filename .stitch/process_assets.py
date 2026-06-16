import os
import shutil
import math
from PIL import Image

def make_white_transparent_smooth(img_path, dest_path):
    print(f"Keying transparency for {img_path} -> {dest_path}...")
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        r, g, b, a = item
        # Compute distance to pure white (255, 255, 255)
        dist = math.sqrt((255 - r)**2 + (255 - g)**2 + (255 - b)**2)
        if dist < 15:
            new_data.append((0, 0, 0, 0)) # Fully transparent
        elif dist < 80:
            # Smoothly transition alpha for anti-aliased edge pixels
            alpha = int((dist - 15) / 65 * 255)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    img.save(dest_path, "PNG")
    print("Transparency keyed successfully.")

def copy_and_resize(src_path, dest_path, size=None):
    print(f"Processing {src_path} -> {dest_path}...")
    img = Image.open(src_path)
    if size:
        img = img.resize(size, Image.Resampling.LANCZOS)
    img.save(dest_path, "PNG")
    print("Done.")

def main():
    # Source paths of generated images from the artifact directory
    artifact_dir = r"C:\Users\jaina\.gemini\antigravity-ide\brain\1f3cfb62-f4c6-41a0-9681-d5947795f484"
    dest_dir = r"d:\Desktop\Fitness\assets\images"
    os.makedirs(dest_dir, exist_ok=True)
    
    sources = {
        "ios_app_icon": os.path.join(artifact_dir, "ios_app_icon_1781634479118.png"),
        "play_store_icon": os.path.join(artifact_dir, "play_store_icon_1781634491086.png"),
        "android_foreground": os.path.join(artifact_dir, "android_foreground_1781634501385.png"),
        "android_background": os.path.join(artifact_dir, "android_background_1781634510037.png"),
        "splash_ios_light": os.path.join(artifact_dir, "splash_ios_light_1781634518845.png"),
        "splash_ios_dark": os.path.join(artifact_dir, "splash_ios_dark_1781634530365.png"),
        "splash_android_standard": os.path.join(artifact_dir, "splash_android_standard_1781634539699.png"),
        "splash_android_12_icon": os.path.join(artifact_dir, "splash_android_12_icon_1781634548310.png")
    }
    
    # Process iOS App Icon
    copy_and_resize(sources["ios_app_icon"], os.path.join(dest_dir, "ios_app_icon.png"), (1024, 1024))
    
    # Process Play Store Web listing icon
    copy_and_resize(sources["play_store_icon"], os.path.join(dest_dir, "play_store_icon.png"), (512, 512))
    
    # Process Android Adaptive Background
    copy_and_resize(sources["android_background"], os.path.join(dest_dir, "android_background.png"), (512, 512))
    
    # Process Android Adaptive Foreground (make transparent)
    make_white_transparent_smooth(sources["android_foreground"], os.path.join(dest_dir, "android_foreground.png"))
    
    # Process iOS light splash
    copy_and_resize(sources["splash_ios_light"], os.path.join(dest_dir, "splash_ios_light.png"), (1125, 2436))
    
    # Process iOS dark splash
    copy_and_resize(sources["splash_ios_dark"], os.path.join(dest_dir, "splash_ios_dark.png"), (1125, 2436))
    
    # Process Android standard splash
    copy_and_resize(sources["splash_android_standard"], os.path.join(dest_dir, "splash_android_standard.png"), (1080, 1920))
    
    # Process Android 12 splash icon (make transparent and size to 288x288)
    make_white_transparent_smooth(sources["splash_android_12_icon"], os.path.join(dest_dir, "splash_android_12_icon.png"))

if __name__ == "__main__":
    main()
