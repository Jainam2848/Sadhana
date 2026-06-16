import json
import os
import urllib.request
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def download_file(url, dest_path):
    print(f"Downloading {url} to {dest_path}...")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as f:
                f.write(response.read())
        print("Success")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    designs_dir = os.path.join(base_dir, "designs")
    os.makedirs(designs_dir, exist_ok=True)
    
    screens_json_path = os.path.join(base_dir, "screens.json")
    with open(screens_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for screen in data["screens"]:
        title = screen["title"]
        slug = slugify(title)
        
        # HTML download
        html_url = screen.get("htmlCode", {}).get("downloadUrl")
        if html_url:
            ext = ".html"
            if title == "DESIGN.md":
                ext = ".md"
            html_dest = os.path.join(designs_dir, f"{slug}{ext}")
            download_file(html_url, html_dest)
            
        # Image download
        screenshot_url = screen.get("screenshot", {}).get("downloadUrl")
        if screenshot_url:
            # Append =w1000 if not present to get full resolution
            if "=w" not in screenshot_url:
                if "?" in screenshot_url:
                    img_url = screenshot_url + "&w1000"
                else:
                    img_url = screenshot_url + "=w1000"
            else:
                img_url = screenshot_url
            img_dest = os.path.join(designs_dir, f"{slug}.png")
            download_file(img_url, img_dest)

if __name__ == "__main__":
    main()
