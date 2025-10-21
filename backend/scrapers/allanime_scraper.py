"""
AllAnime API Scraper - Based on ani-cli implementation
Uses the same API that ani-cli uses (https://api.allanime.day)
"""
import requests
import re
import json
from typing import Optional, Dict
from .base_scraper import BaseScraper


class AllAnimeScraper(BaseScraper):
    """
    Scraper that uses the AllAnime GraphQL API
    This is the same API that ani-cli uses
    """
    
    def __init__(self):
        super().__init__()
        # Based on ani-cli configuration
        self.api_base = "https://api.allanime.day"
        self.referer = "https://allmanga.to"
        self.agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0"
        
        # Update session headers - Accept compressed responses
        self.session.headers.update({
            'User-Agent': self.agent,
            'Referer': self.referer,
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'application/json'
        })
    
    def search_anime(self, anime_name: str) -> Optional[str]:
        """Search for anime using GraphQL API"""
        try:
            # GraphQL query from ani-cli
            search_gql = '''
            query($search: SearchInput, $limit: Int, $page: Int, $translationType: VaildTranslationTypeEnumType) {
                shows(search: $search, limit: $limit, page: $page, translationType: $translationType) {
                    edges {
                        _id
                        name
                        availableEpisodes
                        __typename
                    }
                }
            }
            '''
            
            variables = {
                "search": {
                    "allowAdult": False,
                    "allowUnknown": False,
                    "query": anime_name
                },
                "limit": 40,
                "page": 1,
                "translationType": "sub",
                "countryOrigin": "ALL"
            }
            
            response = self.session.get(
                f"{self.api_base}/api",
                params={
                    'variables': json.dumps(variables),
                    'query': search_gql
                },
                timeout=15
            )
            
            print(f"[DEBUG] API Status: {response.status_code}")
            print(f"[DEBUG] API Response length: {len(response.text)} bytes")
            print(f"[DEBUG] Response preview: {response.text[:200]}")
            
            if response.status_code != 200:
                print(f"[ERROR] Search API returned {response.status_code}")
                print(f"[ERROR] Response: {response.text[:500]}")
                return None
            
            data = response.json()
            
            if 'data' in data and 'shows' in data['data'] and 'edges' in data['data']['shows']:
                shows = data['data']['shows']['edges']
                if shows:
                    # Return the first show's ID
                    show_id = shows[0]['_id']
                    show_name = shows[0]['name']
                    print(f"[SUCCESS] Found: {show_name} (ID: {show_id})")
                    return show_id
            
            print(f"[WARNING] No shows found for: {anime_name}")
            return None
            
        except Exception as e:
            print(f"[ERROR] Search failed: {e}")
            return None
    
    def get_episode_url(self, anime_id: str, episode_num: int) -> Optional[str]:
        """
        For AllAnime API, we don't need episode URL
        We go straight to video extraction
        """
        return anime_id  # Return the show ID
    
    def extract_video_url(self, show_id: str, episode_num: int = None) -> Optional[Dict[str, str]]:
        """
        Extract video URLs using AllAnime API
        Note: episode_num should be passed separately
        """
        if episode_num is None:
            print("[ERROR] Episode number required")
            return None
        
        try:
            # GraphQL query for episode sources
            episode_gql = '''
            query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {
                episode(showId: $showId, translationType: $translationType, episodeString: $episodeString) {
                    episodeString
                    sourceUrls
                }
            }
            '''
            
            variables = {
                "showId": show_id,
                "translationType": "sub",
                "episodeString": str(episode_num)
            }
            
            print(f"[INFO] Fetching episode {episode_num} for show {show_id}")
            
            response = self.session.get(
                f"{self.api_base}/api",
                params={
                    'variables': json.dumps(variables),
                    'query': episode_gql
                },
                timeout=15
            )
            
            if response.status_code != 200:
                print(f"[ERROR] Episode API returned {response.status_code}")
                return None
            
            data = response.json()
            
            if 'data' in data and 'episode' in data['data']:
                episode_data = data['data']['episode']
                source_urls = episode_data.get('sourceUrls', '')
                
                print(f"[INFO] Got source URLs data")
                
                # Parse source URLs (they're encoded)
                video_urls = self._parse_source_urls(source_urls)
                if video_urls:
                    return video_urls
            
            print(f"[WARNING] No episode data found")
            return None
            
        except Exception as e:
            print(f"[ERROR] Episode extraction failed: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def _parse_source_urls(self, source_urls_str: str) -> Optional[Dict[str, str]]:
        """Parse the source URLs from API response"""
        try:
            # Source URLs come as JSON array
            # Format: [{"sourceUrl":"--ENCODED_URL","sourceName":"PROVIDER"}]
            
            # Try to parse as JSON
            try:
                sources = json.loads(source_urls_str) if isinstance(source_urls_str, str) else source_urls_str
            except:
                sources = source_urls_str
            
            if not sources:
                return None
            
            # Extract URLs from sources
            for source in sources:
                if isinstance(source, dict):
                    source_url = source.get('sourceUrl', '')
                    source_name = source.get('sourceName', 'unknown')
                    
                    if source_url.startswith('--'):
                        # Decode the URL (ani-cli uses sed substitution)
                        decoded_url = self._decode_allanime_url(source_url[2:])
                        
                        if decoded_url:
                            print(f"[SUCCESS] Found video URL from {source_name}")
                            return {
                                'default': decoded_url,
                                '720p': decoded_url,
                                'provider': source_name
                            }
            
            return None
            
        except Exception as e:
            print(f"[ERROR] Failed to parse source URLs: {e}")
            return None
    
    def _decode_allanime_url(self, encoded: str) -> Optional[str]:
        """
        Decode AllAnime URLs using the same method as ani-cli
        Based on the hex substitution pattern in ani-cli
        """
        try:
            # Convert hex pairs to characters
            # This is a simplified version of ani-cli's sed substitution
            decode_map = {
                '79': 'A', '7a': 'B', '7b': 'C', '7c': 'D', '7d': 'E', '7e': 'F',
                '7f': 'G', '70': 'H', '71': 'I', '72': 'J', '73': 'K', '74': 'L',
                '75': 'M', '76': 'N', '77': 'O', '68': 'P', '69': 'Q', '6a': 'R',
                '6b': 'S', '6c': 'T', '6d': 'U', '6e': 'V', '6f': 'W', '60': 'X',
                '61': 'Y', '62': 'Z', '59': 'a', '5a': 'b', '5b': 'c', '5c': 'd',
                '5d': 'e', '5e': 'f', '5f': 'g', '50': 'h', '51': 'i', '52': 'j',
                '53': 'k', '54': 'l', '55': 'm', '56': 'n', '57': 'o', '48': 'p',
                '49': 'q', '4a': 'r', '4b': 's', '4c': 't', '4d': 'u', '4e': 'v',
                '4f': 'w', '40': 'x', '41': 'y', '42': 'z', '08': '0', '09': '1',
                '0a': '2', '0b': '3', '0c': '4', '0d': '5', '0e': '6', '0f': '7',
                '00': '8', '01': '9', '15': '-', '16': '.', '67': '_', '46': '~',
                '02': ':', '17': '/', '07': '?', '1b': '#', '63': '[', '65': ']',
                '78': '@', '19': '!', '1c': '$', '1e': '&', '10': '(', '11': ')',
                '12': '*', '13': '+', '14': ',', '03': ';', '05': '=', '1d': '%'
            }
            
            # Split into pairs and decode
            result = []
            for i in range(0, len(encoded), 2):
                hex_pair = encoded[i:i+2]
                if hex_pair in decode_map:
                    result.append(decode_map[hex_pair])
                else:
                    result.append('?')  # Unknown character
            
            decoded = ''.join(result)
            
            # Fix the clock URL pattern (from ani-cli)
            decoded = decoded.replace('/clock', '/clock.json')
            
            return decoded
            
        except Exception as e:
            print(f"[ERROR] URL decoding failed: {e}")
            return None
    
    def get_video(self, anime_name: str, episode_num: int) -> Optional[Dict[str, str]]:
        """Override to handle episode number properly"""
        try:
            # Search for anime
            show_id = self.search_anime(anime_name)
            if not show_id:
                return None
            
            # Extract video URL (needs episode number)
            video_urls = self.extract_video_url(show_id, episode_num)
            return video_urls
            
        except Exception as e:
            print(f"Error in {self.__class__.__name__}: {e}")
            return None

