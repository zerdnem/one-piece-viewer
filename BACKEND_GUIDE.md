# Backend Implementation Guide

This guide explains how to implement the video scraping backend to enable actual video playback.

## Architecture Overview

```
Frontend (React) → Backend API (FastAPI) → Video Scraper → Streaming Sites → Video URLs
```

## Prerequisites

- Python 3.8+
- Redis (for caching)
- Basic understanding of web scraping
- Knowledge of ani-cli source code

## Step 1: Study ani-cli

ani-cli is open source and written in shell script. Study its logic:

```bash
# Clone ani-cli
git clone https://github.com/pystardust/ani-cli.git
cd ani-cli

# Read the source code
cat ani-cli
```

### Key Functions to Understand:
1. **Search function** - How it searches for anime
2. **Episode fetching** - How it gets episode links
3. **Video extraction** - How it extracts video URLs from embed pages
4. **Provider handling** - Which streaming sites it uses

## Step 2: Set Up FastAPI Backend

Create a new backend directory:

```bash
cd one-piece-viewer
mkdir backend
cd backend
```

### Install Dependencies

```bash
pip install fastapi uvicorn redis requests beautifulsoup4 aiohttp python-dotenv
```

### Create `requirements.txt`

```txt
fastapi==0.104.1
uvicorn==0.24.0
redis==5.0.1
requests==2.31.0
beautifulsoup4==4.12.2
aiohttp==3.9.1
python-dotenv==1.0.0
```

## Step 3: Implement Video Scraper

### `backend/scrapers/video_scraper.py`

```python
import requests
from bs4 import BeautifulSoup
import re
import base64

class VideoScraper:
    def __init__(self):
        self.base_url = "https://gogoanime.provider"  # Example provider
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def search_anime(self, anime_name):
        """Search for anime and return the anime ID."""
        search_url = f"{self.base_url}/search.html?keyword={anime_name}"
        response = self.session.get(search_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract anime ID from search results
        # This is provider-specific logic
        first_result = soup.find('div', class_='img')
        if first_result:
            link = first_result.find('a')['href']
            return link.split('/')[-1]
        return None
    
    def get_episode_url(self, anime_id, episode_num):
        """Get the episode page URL."""
        return f"{self.base_url}/{anime_id}-episode-{episode_num}"
    
    def extract_embed_url(self, episode_url):
        """Extract the video embed URL from episode page."""
        response = self.session.get(episode_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find embed iframe
        iframe = soup.find('iframe', id='playerframe')
        if iframe:
            return iframe['src']
        return None
    
    def extract_video_url(self, embed_url):
        """Extract the actual video stream URL from embed page."""
        response = self.session.get(embed_url)
        
        # Look for video sources in page
        # This is highly provider-specific
        video_pattern = r'"file":"(.*?)"'
        matches = re.findall(video_pattern, response.text)
        
        if matches:
            # Decode if base64
            video_url = matches[0]
            if 'base64' in video_url:
                video_url = base64.b64decode(video_url).decode()
            return video_url
        return None
    
    def get_video_url(self, anime_name, episode_num):
        """Main function to get video URL."""
        try:
            # Search for anime
            anime_id = self.search_anime(anime_name)
            if not anime_id:
                return None
            
            # Get episode page
            episode_url = self.get_episode_url(anime_id, episode_num)
            
            # Extract embed URL
            embed_url = self.extract_embed_url(episode_url)
            if not embed_url:
                return None
            
            # Extract video URL
            video_url = self.extract_video_url(embed_url)
            return video_url
            
        except Exception as e:
            print(f"Error scraping video: {e}")
            return None

# Singleton instance
scraper = VideoScraper()
```

## Step 4: Create FastAPI Application

### `backend/main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import redis
from scrapers.video_scraper import scraper
import json

app = FastAPI(title="One Piece Viewer API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis client for caching
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)
CACHE_DURATION = 3600  # 1 hour

@app.get("/")
async def root():
    return {"message": "One Piece Viewer API"}

@app.get("/api/episode/{episode_num}/video")
async def get_episode_video(episode_num: int):
    """Get video URL for a specific One Piece episode."""
    
    if episode_num < 1 or episode_num > 1200:
        raise HTTPException(status_code=400, detail="Invalid episode number")
    
    # Check cache first
    cache_key = f"onepiece_ep_{episode_num}"
    cached_url = redis_client.get(cache_key)
    
    if cached_url:
        return {
            "episode": episode_num,
            "video_url": cached_url,
            "cached": True
        }
    
    # Scrape video URL
    video_url = scraper.get_video_url("One Piece", episode_num)
    
    if not video_url:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Cache the URL
    redis_client.setex(cache_key, CACHE_DURATION, video_url)
    
    return {
        "episode": episode_num,
        "video_url": video_url,
        "cached": False
    }

@app.get("/api/health")
async def health_check():
    """Check if the API and Redis are working."""
    try:
        redis_client.ping()
        return {"status": "healthy", "redis": "connected"}
    except:
        return {"status": "unhealthy", "redis": "disconnected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Step 5: Update Frontend to Use Backend

### Update `src/components/VideoPlayer.jsx`

```javascript
const fetchVideoUrl = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Call your backend API
    const response = await fetch(`http://localhost:8000/api/episode/${episodeNumber}/video`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    
    const data = await response.json();
    setVideoUrl(data.video_url);
    
  } catch (err) {
    setError('Failed to load video. Please try again.');
    console.error('Video loading error:', err);
  } finally {
    setLoading(false);
  }
};
```

### Add HTML5 Video Player

```javascript
return (
  <video 
    controls 
    className="w-full aspect-video rounded-xl"
    src={videoUrl}
    autoPlay
  >
    Your browser does not support video playback.
  </video>
);
```

## Step 6: Run the Application

### Terminal 1: Start Redis
```bash
redis-server
```

### Terminal 2: Start Backend
```bash
cd backend
python main.py
```

### Terminal 3: Start Frontend
```bash
cd frontend
npm run dev
```

## Advanced Features

### Multiple Providers
Implement fallback providers if one fails:

```python
class VideoScraper:
    def __init__(self):
        self.providers = [
            GogoAnimeProvider(),
            NineAnimeProvider(),
            AnimePaheProvider()
        ]
    
    def get_video_url(self, anime_name, episode_num):
        for provider in self.providers:
            try:
                url = provider.scrape(anime_name, episode_num)
                if url:
                    return url
            except:
                continue
        return None
```

### Quality Selection
Return multiple quality options:

```python
@app.get("/api/episode/{episode_num}/video")
async def get_episode_video(episode_num: int):
    qualities = scraper.get_all_qualities("One Piece", episode_num)
    return {
        "episode": episode_num,
        "qualities": {
            "1080p": qualities.get('1080p'),
            "720p": qualities.get('720p'),
            "480p": qualities.get('480p'),
            "360p": qualities.get('360p')
        }
    }
```

### Download Support
Add download endpoint:

```python
@app.get("/api/episode/{episode_num}/download")
async def download_episode(episode_num: int):
    video_url = scraper.get_video_url("One Piece", episode_num)
    # Return direct download link or stream file
    return RedirectResponse(video_url)
```

## Security Considerations

1. **Rate Limiting** - Prevent abuse
2. **IP Rotation** - Avoid being blocked
3. **User Authentication** - Control access
4. **HTTPS** - Encrypt traffic
5. **Error Handling** - Don't expose scraping logic

## Legal Considerations

⚠️ **Important**: Scraping copyrighted content is illegal in most jurisdictions.

### Legal Alternatives:
1. **Official APIs** - Partner with Crunchyroll, Funimation
2. **Licensing** - Contact Toei Animation
3. **Deep Linking** - Link to official platforms
4. **Educational Use Only** - Keep it private

## Troubleshooting

### Videos Not Loading
- Check if provider is still online
- Update scraping selectors (sites change frequently)
- Try different providers

### Redis Connection Failed
```bash
# Install Redis
# Windows: Use WSL or download from GitHub
# Mac: brew install redis
# Linux: sudo apt install redis-server

# Start Redis
redis-server
```

### CORS Errors
Make sure your backend CORS settings allow your frontend URL.

---

**Happy Coding! 🏴‍☠️**

