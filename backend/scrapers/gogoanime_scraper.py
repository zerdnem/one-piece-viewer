"""
GogoAnime scraper implementation
Based on ani-cli's gogoanime provider
"""
import re
import json
from bs4 import BeautifulSoup
from typing import Optional, Dict
from urllib.parse import urljoin, urlparse, parse_qs
from .base_scraper import BaseScraper


class GogoAnimeScraper(BaseScraper):
    """Scraper for GogoAnime (similar to ani-cli implementation)"""
    
    def __init__(self):
        super().__init__()
        # Note: These URLs might need to be updated as sites change domains
        # Try multiple mirrors in case one is down
        self.mirrors = [
            "https://anitaku.pe",
            "https://anitaku.to",
            "https://gogoanime3.co",
            "https://www1.gogoanime.bid"
        ]
        self.base_url = self.mirrors[0]
        self.search_url = f"{self.base_url}/search.html"
    
    def search_anime(self, anime_name: str) -> Optional[str]:
        """Search for One Piece and return the anime ID"""
        try:
            # For One Piece, we can use the known ID to be more reliable
            if "one piece" in anime_name.lower():
                print(f"[DEBUG] Using known One Piece ID")
                return "one-piece"
            
            # Try each mirror until one works
            for mirror in self.mirrors:
                try:
                    search_url = f"{mirror}/search.html"
                    params = {'keyword': anime_name}
                    response = self.session.get(search_url, params=params, timeout=10)
                    
                    if response.status_code != 200:
                        continue
                    
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Find first search result
                    result = soup.find('li')
                    if result:
                        link = result.find('a')
                        if link and link.get('href'):
                            # Extract anime ID from URL
                            href = link.get('href')
                            anime_id = href.split('/')[-1]
                            print(f"[DEBUG] Found anime ID: {anime_id}")
                            self.base_url = mirror  # Use this mirror for future requests
                            return anime_id
                except Exception as e:
                    print(f"[DEBUG] Mirror {mirror} failed: {e}")
                    continue
            
            return None
            
        except Exception as e:
            print(f"Search error: {e}")
            return None
    
    def get_episode_url(self, anime_id: str, episode_num: int) -> Optional[str]:
        """Construct the episode URL"""
        try:
            # Try different URL formats and mirrors
            url_formats = [
                f"{anime_id}-episode-{episode_num}",
                f"{anime_id}-episode-{episode_num}-english-subbed",
            ]
            
            for mirror in self.mirrors:
                for url_format in url_formats:
                    episode_url = f"{mirror}/{url_format}"
                    
                    try:
                        print(f"[DEBUG] Trying URL: {episode_url}")
                        response = self.session.head(episode_url, timeout=10, allow_redirects=True)
                        
                        if response.status_code == 200:
                            print(f"[DEBUG] Found working URL: {episode_url}")
                            self.base_url = mirror
                            return episode_url
                        else:
                            print(f"[DEBUG] URL returned {response.status_code}")
                    except Exception as e:
                        print(f"[DEBUG] URL failed: {e}")
                        continue
            
            print(f"[ERROR] No working URL found for {anime_id} episode {episode_num}")
            return None
            
        except Exception as e:
            print(f"Episode URL error: {e}")
            return None
    
    def extract_video_url(self, episode_url: str) -> Optional[Dict[str, str]]:
        """Extract video URLs from episode page"""
        try:
            print(f"[DEBUG] Fetching episode page: {episode_url}")
            response = self.session.get(episode_url, timeout=15)
            
            if response.status_code != 200:
                print(f"[DEBUG] Page returned status {response.status_code}")
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            print(f"[DEBUG] Page fetched, parsing...")
            
            # Method 1: Find iframe with video player
            iframes = soup.find_all('iframe')
            print(f"[DEBUG] Found {len(iframes)} iframes")
            
            for iframe in iframes:
                src = iframe.get('src')
                if src:
                    print(f"[DEBUG] Found iframe: {src[:80]}...")
                    if not src.startswith('http'):
                        src = urljoin(self.base_url, src)
                    
                    # Try to extract from embed
                    embed_videos = self._extract_from_embed(src)
                    if embed_videos:
                        return embed_videos
            
            # Method 2: Find download links
            download_section = soup.find('div', class_='anime_muti_link')
            if download_section:
                print(f"[DEBUG] Found download section")
                links = download_section.find_all('a')
                video_urls = {}
                
                for link in links:
                    href = link.get('href')
                    text = link.get_text().strip()
                    print(f"[DEBUG] Found link: {text} -> {href[:50] if href else 'None'}...")
                    
                    if href and ('download' in text.lower() or 'vidcdn' in href.lower() or 'streamwish' in href.lower()):
                        quality = 'default'
                        quality_match = re.search(r'(\d+[Pp])', text)
                        if quality_match:
                            quality = quality_match.group(1).lower()
                        video_urls[quality] = href
                
                if video_urls:
                    print(f"[DEBUG] Extracted {len(video_urls)} video URLs")
                    return video_urls
            
            # Method 3: Search for any video URLs in page source
            video_patterns = [
                r'https?://[^\s"\'<>]+\.m3u8',
                r'https?://[^\s"\'<>]+/playlist\.m3u8',
                r'file:\s*["\']([^"\']+\.m3u8[^"\']*)["\']',
            ]
            
            for pattern in video_patterns:
                matches = re.findall(pattern, response.text)
                if matches:
                    print(f"[DEBUG] Found video URL via regex: {matches[0][:80]}...")
                    return {'default': matches[0], '720p': matches[0]}
            
            print(f"[DEBUG] No video URLs found on page")
            return None
            
        except Exception as e:
            print(f"[ERROR] Video extraction error: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def _extract_from_embed(self, embed_url: str) -> Optional[Dict[str, str]]:
        """Extract video URLs from embed page"""
        try:
            print(f"[DEBUG] Fetching embed: {embed_url[:80]}...")
            response = self.session.get(embed_url, timeout=15)
            
            if response.status_code != 200:
                print(f"[DEBUG] Embed returned status {response.status_code}")
                return None
            
            print(f"[DEBUG] Embed page fetched, searching for video URLs...")
            
            # Look for video sources in the page
            # This regex pattern looks for common video URL patterns
            video_patterns = [
                r'"file":\s*"(https?://[^"]+\.m3u8[^"]*)"',
                r'"src":\s*"(https?://[^"]+\.m3u8[^"]*)"',
                r"'file':\s*'(https?://[^']+\.m3u8[^']*)'",
                r'source.*?src=[\'"](https?://[^"\']+)["\']',
                r'(https://[^\s"\'<>]+\.m3u8[^\s"\'<>]*)',
                r'"sources":\s*\[\s*{\s*"file":\s*"([^"]+)"',
            ]
            
            for i, pattern in enumerate(video_patterns):
                matches = re.findall(pattern, response.text, re.IGNORECASE)
                if matches:
                    video_url = matches[0]
                    print(f"[DEBUG] Found video URL (pattern {i+1}): {video_url[:80]}...")
                    
                    # Clean up the URL
                    video_url = video_url.replace('\\/', '/')
                    
                    return {
                        'default': video_url,
                        '720p': video_url,
                        'source': 'embed'
                    }
            
            print(f"[DEBUG] No video URL found in embed")
            return None
            
        except Exception as e:
            print(f"[ERROR] Embed extraction error: {e}")
            import traceback
            traceback.print_exc()
            return None

