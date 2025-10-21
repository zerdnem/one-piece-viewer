"""
Diagnostic script to see what's actually on the anime page
"""
import requests
from bs4 import BeautifulSoup
import cloudscraper

def diagnose_page(url):
    """Fetch page and show its structure"""
    print(f"\n{'='*60}")
    print(f"Diagnosing: {url}")
    print(f"{'='*60}\n")
    
    try:
        # Use cloudscraper to bypass protections
        scraper = cloudscraper.create_scraper()
        response = scraper.get(url, timeout=15)
        
        print(f"Status Code: {response.status_code}")
        print(f"Content Length: {len(response.text)} bytes\n")
        
        if response.status_code != 200:
            print(f"❌ Page returned {response.status_code}")
            return
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Check for iframes
        iframes = soup.find_all('iframe')
        print(f"📺 Iframes found: {len(iframes)}")
        for i, iframe in enumerate(iframes, 1):
            src = iframe.get('src', 'No src')
            print(f"  {i}. {src[:80]}...")
        
        # Check for video tags
        videos = soup.find_all('video')
        print(f"\n🎥 Video tags found: {len(videos)}")
        for i, video in enumerate(videos, 1):
            src = video.get('src', 'No src')
            print(f"  {i}. {src[:80] if src else 'No direct src'}...")
        
        # Check for source tags
        sources = soup.find_all('source')
        print(f"\n📡 Source tags found: {len(sources)}")
        for i, source in enumerate(sources, 1):
            src = source.get('src', 'No src')
            print(f"  {i}. {src[:80]}...")
        
        # Check for common video player divs
        player_divs = soup.find_all(['div', 'section'], class_=lambda x: x and any(
            keyword in str(x).lower() for keyword in ['player', 'video', 'stream', 'embed']
        ))
        print(f"\n🎬 Player containers found: {len(player_divs)}")
        for i, div in enumerate(player_divs[:5], 1):
            classes = div.get('class', [])
            id_attr = div.get('id', 'no-id')
            print(f"  {i}. class='{' '.join(classes) if classes else 'none'}', id='{id_attr}'")
        
        # Look for m3u8 URLs in page source
        import re
        m3u8_urls = re.findall(r'https?://[^\s"\'<>]+\.m3u8[^\s"\'<>]*', response.text)
        print(f"\n🔗 M3U8 URLs found in source: {len(m3u8_urls)}")
        for i, url in enumerate(m3u8_urls[:3], 1):
            print(f"  {i}. {url[:80]}...")
        
        # Look for mp4 URLs
        mp4_urls = re.findall(r'https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*', response.text)
        print(f"\n🎞️  MP4 URLs found in source: {len(mp4_urls)}")
        for i, url in enumerate(mp4_urls[:3], 1):
            print(f"  {i}. {url[:80]}...")
        
        # Save page HTML for manual inspection
        with open('page_debug.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"\n💾 Full page saved to: page_debug.html")
        
        # Show a snippet of the page
        print(f"\n📄 Page snippet (first 500 chars):")
        print("-" * 60)
        print(response.text[:500])
        print("-" * 60)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Test with One Piece episode 1
    url = "https://anitaku.pe/one-piece-episode-1"
    diagnose_page(url)
    
    print(f"\n{'='*60}")
    print("💡 Next steps:")
    print("1. Review the output above")
    print("2. Check page_debug.html file")
    print("3. Update the scraper based on actual page structure")
    print(f"{'='*60}\n")

