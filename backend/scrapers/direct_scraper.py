"""
Direct web scraper for anime streaming sites
Does NOT use ani-cli - pure Python implementation
"""
import re
import json
import base64
from bs4 import BeautifulSoup
from typing import Optional, Dict
from .base_scraper import BaseScraper
from urllib.parse import urljoin, urlparse


class DirectWebScraper(BaseScraper):
    """
    Direct web scraper that extracts video URLs from anime streaming pages
    This is a pure Python implementation without external dependencies
    """
    
    def __init__(self):
        super().__init__()
        # Updated working mirrors
        self.mirrors = [
            "https://anitaku.pe",
            "https://anitaku.to",
        ]
        self.base_url = self.mirrors[0]
        
    def search_anime(self, anime_name: str) -> Optional[str]:
        """Search for anime and return ID"""
        # For One Piece, use known ID
        if "one piece" in anime_name.lower():
            return "one-piece"
        return None
    
    def get_episode_url(self, anime_id: str, episode_num: int) -> Optional[str]:
        """Get episode page URL"""
        # Try different URL formats
        url_patterns = [
            f"{anime_id}-episode-{episode_num}",
        ]
        
        for mirror in self.mirrors:
            for pattern in url_patterns:
                url = f"{mirror}/{pattern}"
                try:
                    response = self.session.head(url, timeout=10, allow_redirects=True)
                    if response.status_code == 200:
                        self.base_url = mirror
                        return url
                except:
                    continue
        return None
    
    def extract_video_url(self, episode_url: str) -> Optional[Dict[str, str]]:
        """
        Extract video URLs from episode page
        Uses multiple extraction methods
        """
        try:
            print(f"[INFO] Fetching: {episode_url}")
            response = self.session.get(episode_url, timeout=15)
            
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Method 1: Extract from iframe sources
            video_url = self._extract_from_iframes(soup, episode_url)
            if video_url:
                return video_url
            
            # Method 2: Extract from JavaScript variables
            video_url = self._extract_from_js_vars(response.text)
            if video_url:
                return video_url
            
            # Method 3: Extract from page sources
            video_url = self._extract_from_page_source(response.text)
            if video_url:
                return video_url
            
            print(f"[WARNING] No video URLs found")
            return None
            
        except Exception as e:
            print(f"[ERROR] Extraction failed: {e}")
            return None
    
    def _extract_from_iframes(self, soup, base_url) -> Optional[Dict[str, str]]:
        """Extract from iframe embed players"""
        iframes = soup.find_all('iframe')
        
        for iframe in iframes:
            src = iframe.get('src', '')
            if not src:
                continue
                
            if not src.startswith('http'):
                src = urljoin(base_url, src)
            
            print(f"[INFO] Checking iframe: {src[:60]}...")
            
            # Skip ads and non-video iframes
            if any(skip in src.lower() for skip in ['ads', 'banner', 'promo']):
                continue
            
            try:
                embed_response = self.session.get(src, timeout=15)
                if embed_response.status_code == 200:
                    # Look for video URLs in embed page
                    video_urls = self._find_video_urls_in_text(embed_response.text)
                    if video_urls:
                        return video_urls
            except:
                continue
        
        return None
    
    def _extract_from_js_vars(self, html_text) -> Optional[Dict[str, str]]:
        """Extract from JavaScript variables in page source"""
        # Look for common patterns where video URLs are stored
        js_patterns = [
            r'sources:\s*\[\s*{\s*file:\s*["\']([^"\']+)["\']',
            r'source:\s*["\']([^"\']+\.m3u8[^"\']*)["\']',
            r'file:\s*["\']([^"\']+\.m3u8[^"\']*)["\']',
            r'url:\s*["\']([^"\']+\.m3u8[^"\']*)["\']',
            r'videoUrl:\s*["\']([^"\']+)["\']',
        ]
        
        for pattern in js_patterns:
            matches = re.findall(pattern, html_text, re.IGNORECASE)
            if matches:
                url = matches[0].replace('\\/', '/')
                if 'm3u8' in url or 'mp4' in url:
                    print(f"[SUCCESS] Found video URL in JS: {url[:60]}...")
                    return {
                        'default': url,
                        '720p': url,
                        'source': 'javascript'
                    }
        
        return None
    
    def _extract_from_page_source(self, html_text) -> Optional[Dict[str, str]]:
        """Extract direct video URLs from page source"""
        return self._find_video_urls_in_text(html_text)
    
    def _find_video_urls_in_text(self, text) -> Optional[Dict[str, str]]:
        """Find video URLs in any text"""
        # Comprehensive video URL patterns
        patterns = [
            r'(https?://[^\s"\'<>]+\.m3u8[^\s"\'<>]*)',
            r'(https?://[^\s"\'<>]+/playlist\.m3u8[^\s"\'<>]*)',
            r'(https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                url = matches[0]
                # Clean up the URL
                url = url.replace('\\/', '/').replace('\\', '')
                
                # Validate URL
                if url.startswith('http') and ('m3u8' in url or 'mp4' in url):
                    print(f"[SUCCESS] Found video URL: {url[:60]}...")
                    return {
                        'default': url,
                        '720p': url,
                        '1080p': url,
                        'source': 'direct'
                    }
        
        return None

