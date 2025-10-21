"""
Main video scraper that tries multiple providers
"""
from typing import Optional, Dict
from .allanime_scraper import AllAnimeScraper
from .gogoanime_scraper import GogoAnimeScraper
from .direct_scraper import DirectWebScraper


class VideoScraper:
    """Main scraper that tries multiple providers with fallback"""
    
    def __init__(self):
        # Initialize all available scrapers (in order of preference)
        self.scrapers = [
            AllAnimeScraper(),       # Try AllAnime API first (same as ani-cli)
            DirectWebScraper(),      # Fallback to direct scraper
            GogoAnimeScraper(),      # Fallback to GogoAnime scraper
            # Add more scrapers here as fallbacks
            # NineAnimeScraper(),
            # AnimePaheScraper(),
        ]
    
    def get_video_url(self, anime_name: str, episode_num: int) -> Optional[Dict[str, any]]:
        """
        Try to get video URL from available scrapers
        Returns dict with video URLs and metadata
        """
        for scraper in self.scrapers:
            try:
                print(f"Trying {scraper.__class__.__name__}...")
                result = scraper.get_video(anime_name, episode_num)
                
                if result:
                    return {
                        'success': True,
                        'episode': episode_num,
                        'anime': anime_name,
                        'provider': scraper.__class__.__name__,
                        'video_urls': result
                    }
                    
            except Exception as e:
                print(f"Error with {scraper.__class__.__name__}: {e}")
                continue
        
        return {
            'success': False,
            'error': 'No video sources found',
            'episode': episode_num,
            'anime': anime_name
        }


# Singleton instance
video_scraper = VideoScraper()

