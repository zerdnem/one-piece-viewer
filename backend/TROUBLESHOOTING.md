# 🔧 Troubleshooting Video Scraping

## Issue: 404 Not Found Errors

If you're seeing errors like:
```
Trying GogoAnimeScraper...
INFO: 127.0.0.1:59330 - "GET /api/episode/870/video HTTP/1.1" 404 Not Found
```

This means the video scraper cannot find the episode. Here's how to fix it:

---

## Quick Fixes

### 1. Test the Scraper

Run the test script to see what's working:

```bash
cd backend
python test_scraper.py
```

This will test multiple episodes and show which ones work.

### 2. Test Specific Episode

```bash
python test_scraper.py 870
```

This will show detailed debug output for episode 870.

### 3. Check Backend Logs

Look at the backend terminal for debug messages like:
```
[DEBUG] Trying URL: https://anitaku.pe/one-piece-episode-870
[DEBUG] URL returned 404
```

---

## Common Causes

### Cause 1: Provider Site Changed

**Symptoms:** All episodes return 404

**Solution:** Update the mirror URLs in `scrapers/gogoanime_scraper.py`

Check current working GogoAnime mirrors:
- https://anitaku.pe
- https://anitaku.to  
- https://gogoanime3.co

Update line 20-24 in `gogoanime_scraper.py`:
```python
self.mirrors = [
    "https://working-mirror-1.com",
    "https://working-mirror-2.com",
]
```

### Cause 2: Episode Format Changed

**Symptoms:** Some episodes work, others don't

**Solution:** Update URL formats in `get_episode_url()` method

Common formats:
- `one-piece-episode-870`
- `one-piece-episode-870-english-subbed`
- `one-piece-episode-0870` (with padding)
- `one-piece-tv-episode-870`

### Cause 3: Cloudflare Protection

**Symptoms:** Requests timeout or return 403

**Solution:** The scraper already uses `cloudscraper`, but you may need to:
1. Add delays between requests
2. Use proxy servers
3. Rotate user agents

### Cause 4: Episode Not Available

**Symptoms:** Recent episodes fail

**Solution:** The episode may not be uploaded yet. Try:
- Older episodes (100-800 usually work well)
- Wait a few days for new episodes

---

## Debugging Steps

### Step 1: Check if Site is Accessible

Open browser and visit:
```
https://anitaku.pe/one-piece-episode-1
```

If this loads, the site is working.

### Step 2: Inspect Network Traffic

1. Open browser DevTools (F12)
2. Go to Network tab
3. Visit an episode page
4. Look for video URLs in network requests

### Step 3: Update Scraper

Based on what you find, update the scraper code.

---

## Alternative Solutions

### Solution 1: Use Different Provider

Add more scrapers to `video_scraper.py`:

```python
self.scrapers = [
    GogoAnimeScraper(),
    AnimePaheScraper(),      # Add this
    NineAnimeScraper(),       # Add this
]
```

### Solution 2: Manual Video URLs

For testing, you can manually provide video URLs by modifying the API:

```python
# In main.py, add a test endpoint:
@app.get("/api/episode/{episode_num}/video/test")
async def test_video(episode_num: int):
    return {
        "success": True,
        "video_urls": {
            "720p": "https://test-video-url.m3u8"
        }
    }
```

### Solution 3: Use Legal APIs

Consider integrating with official APIs:
- Crunchyroll API (requires partnership)
- Funimation API
- JikanAPI (for metadata only)

---

## Testing Checklist

- [ ] Backend is running
- [ ] Can access `/health` endpoint
- [ ] Test scraper runs without errors
- [ ] At least one episode works
- [ ] Browser can load provider site
- [ ] No firewall/antivirus blocking requests
- [ ] Internet connection is stable

---

## Getting Help

### Check Logs

Backend logs show detailed debugging:
```
[DEBUG] Using known One Piece ID
[DEBUG] Trying URL: https://anitaku.pe/one-piece-episode-870
[DEBUG] URL returned 404
[ERROR] No working URL found for one-piece episode 870
```

### Test with curl

```bash
curl http://localhost:8000/api/episode/1/video
```

### Check API Docs

Visit `http://localhost:8000/docs` to test endpoints directly.

---

## Current Status

The scraper is configured to:
- ✅ Try multiple mirror sites
- ✅ Try multiple URL formats  
- ✅ Use Cloudflare bypass
- ✅ Provide detailed debug logs
- ✅ Fallback to alternative providers (when added)

**Note:** Anime scraping is inherently fragile as sites change frequently. Regular maintenance may be needed.

---

## Quick Test

Run this in backend directory:
```bash
# Test if scraping works at all
python test_scraper.py

# Test specific episode that's likely to work
python test_scraper.py 1

# Test recent episode
python test_scraper.py 1050
```

---

## Need More Help?

1. Check if site is accessible in browser
2. Try episodes 1-100 (most reliable)
3. Wait for recent episodes to be uploaded
4. Consider using cached/downloaded episodes
5. Look into legal streaming APIs

**Remember:** Video scraping is in a legal gray area. Consider official sources when possible.

