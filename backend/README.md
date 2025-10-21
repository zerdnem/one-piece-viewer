# One Piece Viewer Backend

FastAPI backend with video scraping capabilities (similar to ani-cli).

## Features

- 🎬 Video URL scraping from multiple providers
- 💾 Redis caching for performance
- 🔄 Fallback provider support
- 🚀 Fast async API with FastAPI
- 🔒 CORS enabled for frontend

## Installation

### Prerequisites

- Python 3.8+
- Redis (optional, for caching)

### Setup

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Configure environment (optional):**

```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start Redis (optional):**

```bash
# Windows: Download from GitHub or use WSL
# Mac: brew install redis && redis-server
# Linux: sudo systemctl start redis
```

## Running the Backend

### Method 1: Direct Python

```bash
python main.py
```

### Method 2: Uvicorn

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: **http://localhost:8000**

## API Endpoints

### Get Episode Video

```http
GET /api/episode/{episode_num}/video
```

**Example:**
```bash
curl http://localhost:8000/api/episode/1/video
```

**Response:**
```json
{
  "success": true,
  "episode": 1,
  "anime": "One Piece",
  "provider": "GogoAnimeScraper",
  "video_urls": {
    "720p": "https://example.com/video.m3u8",
    "default": "https://example.com/video.m3u8"
  },
  "cached": false
}
```

### Health Check

```http
GET /health
```

### Test Scraping

```http
GET /api/test/scrape
```

Tests scraping with One Piece episode 1.

### Clear Cache

```http
DELETE /api/cache/clear
```

Clears all cached video URLs.

## How It Works

### 1. Video Scraping

The backend uses multiple scraper providers with fallback:

1. **GogoAnimeScraper** - Primary provider
2. More providers can be added in `scrapers/`

### 2. Caching

- Video URLs are cached in Redis for 1 hour
- Reduces load on scraping sources
- Falls back to no caching if Redis unavailable

### 3. Provider Fallback

If one provider fails, automatically tries the next.

## Configuration

### Environment Variables

Create `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Cache Configuration
CACHE_DURATION=3600  # 1 hour

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Project Structure

```
backend/
├── main.py                      # FastAPI application
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
├── scrapers/
│   ├── __init__.py
│   ├── base_scraper.py         # Base scraper class
│   ├── gogoanime_scraper.py    # GogoAnime implementation
│   └── video_scraper.py        # Main scraper with fallback
└── README.md
```

## Adding New Providers

To add a new video provider:

1. Create a new scraper class in `scrapers/`
2. Extend `BaseScraper`
3. Implement required methods
4. Add to `VideoScraper` in `video_scraper.py`

Example:

```python
from .base_scraper import BaseScraper

class NewProviderScraper(BaseScraper):
    def search_anime(self, anime_name: str):
        # Implementation
        pass
    
    def get_episode_url(self, anime_id: str, episode_num: int):
        # Implementation
        pass
    
    def extract_video_url(self, episode_url: str):
        # Implementation
        pass
```

## Troubleshooting

### Redis Connection Failed

The API will work without Redis (caching disabled). To enable:

```bash
# Install Redis
# Windows: Use WSL or download from GitHub
# Mac: brew install redis
# Linux: sudo apt install redis-server

# Start Redis
redis-server
```

### Scraping Fails

- Providers may change their URLs/structure
- Update scraper implementation in `scrapers/`
- Check if provider site is accessible

### CORS Errors

Update `CORS_ORIGINS` in `.env` to include your frontend URL.

## Legal Notice

⚠️ **Important:** This scraper accesses unofficial streaming sources. Use responsibly and at your own risk.

## Performance

- **With Redis:** ~50-100ms response time (cached)
- **Without Redis:** ~2-5s response time (scraping)
- **Concurrent requests:** Handles multiple requests efficiently

## Dependencies

- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Requests** - HTTP client
- **BeautifulSoup4** - HTML parsing
- **Redis** - Caching (optional)
- **Cloudscraper** - Bypass cloudflare protection

## Development

### Testing

```bash
# Test scraping
curl http://localhost:8000/api/test/scrape

# Test specific episode
curl http://localhost:8000/api/episode/100/video

# Health check
curl http://localhost:8000/health
```

### API Documentation

FastAPI provides automatic API documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

**Happy scraping! 🏴‍☠️**

