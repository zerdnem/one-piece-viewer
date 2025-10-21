"""
FastAPI backend for One Piece Viewer
Video scraping and caching API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import redis
import os
from dotenv import load_dotenv
from scrapers.video_scraper import video_scraper

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="One Piece Viewer API",
    description="Backend API for video scraping and caching",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis client for caching (optional - will work without Redis)
try:
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        db=int(os.getenv('REDIS_DB', 0)),
        decode_responses=True,
        socket_connect_timeout=2
    )
    redis_client.ping()
    REDIS_AVAILABLE = True
    print("✅ Redis connected successfully")
except Exception as e:
    print(f"⚠️  Redis not available: {e}")
    print("   Continuing without caching...")
    REDIS_AVAILABLE = False
    redis_client = None

CACHE_DURATION = int(os.getenv('CACHE_DURATION', 3600))  # 1 hour


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "One Piece Viewer API",
        "version": "1.0.0",
        "status": "running",
        "redis": "connected" if REDIS_AVAILABLE else "disabled"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "redis": "connected" if REDIS_AVAILABLE else "disabled",
        "scrapers": len(video_scraper.scrapers)
    }


@app.get("/api/episode/{episode_num}/video")
async def get_episode_video(episode_num: int):
    """
    Get video URL for a specific One Piece episode
    
    Args:
        episode_num: Episode number (1-1200+)
    
    Returns:
        JSON with video URLs and metadata
    """
    if episode_num < 1 or episode_num > 1200:
        raise HTTPException(
            status_code=400,
            detail="Invalid episode number. Must be between 1 and 1200."
        )
    
    # Check cache first (if Redis is available)
    cache_key = f"onepiece_ep_{episode_num}"
    
    if REDIS_AVAILABLE and redis_client:
        try:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                import json
                return JSONResponse(content={
                    **json.loads(cached_data),
                    'cached': True
                })
        except Exception as e:
            print(f"Cache read error: {e}")
    
    # Scrape video URL
    try:
        result = video_scraper.get_video_url("One Piece", episode_num)
        
        if not result or not result.get('success'):
            raise HTTPException(
                status_code=404,
                detail=f"Video not found for episode {episode_num}. {result.get('error', '')}"
            )
        
        # Cache the result (if Redis is available)
        if REDIS_AVAILABLE and redis_client:
            try:
                import json
                redis_client.setex(
                    cache_key,
                    CACHE_DURATION,
                    json.dumps(result)
                )
            except Exception as e:
                print(f"Cache write error: {e}")
        
        return JSONResponse(content={
            **result,
            'cached': False
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching video: {str(e)}"
        )


@app.get("/api/test/scrape")
async def test_scrape():
    """
    Test endpoint to verify scraping works
    Tests with One Piece episode 1
    """
    try:
        result = video_scraper.get_video_url("One Piece", 1)
        return {
            "test": "scraping",
            "episode": 1,
            "result": result
        }
    except Exception as e:
        return {
            "test": "scraping",
            "error": str(e)
        }


@app.delete("/api/cache/clear")
async def clear_cache():
    """Clear all cached video URLs"""
    if not REDIS_AVAILABLE or not redis_client:
        return {"message": "Redis not available, no cache to clear"}
    
    try:
        # Clear all One Piece episode caches
        pattern = "onepiece_ep_*"
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
            return {"message": f"Cleared {len(keys)} cached episodes"}
        return {"message": "No cached episodes found"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error clearing cache: {str(e)}"
        )


@app.get("/api/proxy/video")
async def proxy_video(url: str):
    """
    Proxy video stream with proper headers
    This allows the frontend to play videos that require referrer headers
    """
    import requests
    from fastapi.responses import StreamingResponse
    
    try:
        # Set proper headers for the video source
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://allmanga.to',
            'Accept': '*/*',
            'Accept-Encoding': 'identity',
            'Range': 'bytes=0-',
        }
        
        # Stream the video
        response = requests.get(url, headers=headers, stream=True, timeout=30)
        
        if response.status_code not in [200, 206]:
            raise HTTPException(status_code=response.status_code, detail="Video source unavailable")
        
        # Return streaming response
        return StreamingResponse(
            response.iter_content(chunk_size=8192),
            media_type=response.headers.get('content-type', 'video/mp4'),
            headers={
                'Accept-Ranges': 'bytes',
                'Content-Length': response.headers.get('content-length', ''),
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error proxying video: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv('API_HOST', '0.0.0.0')
    port = int(os.getenv('API_PORT', 8000))
    
    print(f"\n🏴‍☠️ Starting One Piece Viewer API on {host}:{port}")
    print(f"📡 CORS enabled for: {origins}")
    print(f"💾 Redis caching: {'enabled' if REDIS_AVAILABLE else 'disabled'}\n")
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    )

