"""
Base scraper class for video providers
"""
from abc import ABC, abstractmethod
import requests
from typing import Optional, Dict, List
import cloudscraper


class BaseScraper(ABC):
    """Abstract base class for video scrapers"""
    
    def __init__(self):
        self.session = cloudscraper.create_scraper()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
    
    @abstractmethod
    def search_anime(self, anime_name: str) -> Optional[str]:
        """Search for anime and return the anime ID/slug"""
        pass
    
    @abstractmethod
    def get_episode_url(self, anime_id: str, episode_num: int) -> Optional[str]:
        """Get the episode page URL"""
        pass
    
    @abstractmethod
    def extract_video_url(self, episode_url: str) -> Optional[Dict[str, str]]:
        """Extract video URLs from episode page"""
        pass
    
    def get_video(self, anime_name: str, episode_num: int) -> Optional[Dict[str, str]]:
        """Main method to get video URLs"""
        try:
            # Search for anime
            anime_id = self.search_anime(anime_name)
            if not anime_id:
                return None
            
            # Get episode URL
            episode_url = self.get_episode_url(anime_id, episode_num)
            if not episode_url:
                return None
            
            # Extract video URLs
            video_urls = self.extract_video_url(episode_url)
            return video_urls
            
        except Exception as e:
            print(f"Error in {self.__class__.__name__}: {e}")
            return None

