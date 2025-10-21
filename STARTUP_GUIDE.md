# 🚀 Startup Guide - One Piece Viewer

Complete guide to run the full application with video playback.

## Overview

The application consists of two parts:
1. **Frontend** (React + Vite) - User interface
2. **Backend** (FastAPI + Python) - Video scraping

## Prerequisites

### Required
- ✅ **Node.js** (v16+) - For frontend
- ✅ **Python** (3.8+) - For backend
- ✅ **pip** - Python package manager

### Optional
- **Redis** - For caching (improves performance)

---

## 🎯 Quick Start (Two Terminal Setup)

### Terminal 1: Backend

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

**Backend will run on:** `http://localhost:8000`

### Terminal 2: Frontend

```bash
# Navigate to frontend
cd frontend

# Start the frontend (if not already running)
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 📋 Detailed Setup Instructions

### Step 1: Backend Setup

#### 1.1 Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Packages installed:**
- FastAPI - Web framework
- Uvicorn - ASGI server
- Requests - HTTP client
- BeautifulSoup4 - HTML parsing
- Redis - Caching (optional)
- Cloudscraper - Bypass protection

#### 1.2 Configure Environment (Optional)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (optional)
```

**Default configuration works out of the box!**

#### 1.3 Start Backend Server

```bash
python main.py
```

**Expected output:**
```
🏴‍☠️ Starting One Piece Viewer API on 0.0.0.0:8000
📡 CORS enabled for: ['http://localhost:5173']
💾 Redis caching: disabled

INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Frontend Setup

#### 2.1 Install Dependencies (if not done)

```bash
cd frontend
npm install
```

#### 2.2 Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Open Application

Open your browser to: **http://localhost:5173**

---

## 🎬 Testing Video Playback

### Method 1: Through UI

1. Go to `http://localhost:5173`
2. Click any arc (e.g., "Romance Dawn Arc")
3. Click "Episode 1"
4. Video should load and play automatically

### Method 2: API Testing

Test the backend directly:

```bash
# Test scraping
curl http://localhost:8000/api/test/scrape

# Test specific episode
curl http://localhost:8000/api/episode/1/video
```

---

## 🔧 Troubleshooting

### Backend Issues

#### Error: "Module not found"
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

#### Error: "Port 8000 already in use"
```bash
# Kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change the port in .env:
API_PORT=8001
```

#### Error: "Redis connection failed"
This is **not critical**. The app works without Redis (caching disabled).

To enable Redis:
```bash
# Windows: Use WSL or download from GitHub
# Mac: brew install redis && redis-server
# Linux: sudo systemctl start redis
```

### Frontend Issues

#### Error: "Cannot connect to backend"
Make sure the backend is running on `http://localhost:8000`

Check backend status:
```bash
curl http://localhost:8000/health
```

#### Error: "Video won't play"
1. Check browser console (F12) for errors
2. Video sources may be unavailable
3. Try a different episode
4. Check if backend is receiving requests

#### Tailwind Styles Not Loading
```bash
# Restart the dev server
npm run dev
```

---

## 🎮 Usage Guide

### Browse Episodes

1. **Home Page** - See all arcs organized by saga
2. **Click an Arc** - View all episodes in that arc
3. **Click an Episode** - Watch the episode

### Random Episode

Click the big **"🎲 Watch Random Episode"** button on the home page.

### Search

Use the search bar to find episodes by:
- Episode number (e.g., "100")
- Arc name (e.g., "Marineford")
- Saga name (e.g., "Summit War")

### Video Controls

- **Play/Pause** - Click video or press Space
- **Seek** - Click progress bar
- **Volume** - Use browser controls
- **Fullscreen** - Click fullscreen button
- **Quality** - Select quality below video (if available)

---

## ⚡ Performance Tips

### With Redis (Recommended)

```bash
# Install and start Redis
redis-server

# Backend will automatically use Redis for caching
# Subsequent requests will be much faster
```

**Performance comparison:**
- Without cache: 2-5 seconds per episode
- With cache: 50-100ms per episode

### Production Build

For deployment, build the frontend:

```bash
cd frontend
npm run build

# Serve the dist folder
npm run preview
```

---

## 🔒 Security Notes

### CORS Configuration

The backend allows requests from:
- `http://localhost:5173` (frontend dev)
- `http://localhost:3000` (alternative)

To add more origins, edit `backend/.env`:
```env
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### API Protection

For production, consider adding:
- API key authentication
- Rate limiting
- Request logging

---

## 📊 Monitoring

### Backend Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "redis": "connected",
  "scrapers": 1
}
```

### Clear Cache

```bash
curl -X DELETE http://localhost:8000/api/cache/clear
```

---

## 🐛 Known Issues

### 1. Video Sources May Fail

Anime streaming sites change frequently. If videos fail:
- Try a different episode
- Check if the provider site is accessible
- Update scraper code if needed

### 2. Some Episodes May Not Load

Not all episodes may be available on all providers.

### 3. Slow Initial Load

First request to an episode takes longer (2-5s) as it scrapes the video URL. Subsequent requests are fast if Redis is enabled.

---

## 🔄 Updates

### Updating Backend

```bash
cd backend
git pull  # if using git
pip install -r requirements.txt --upgrade
```

### Updating Frontend

```bash
cd frontend
git pull  # if using git
npm install
```

---

## 📚 API Documentation

When backend is running, visit:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🎉 Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Health check returns "healthy"
- [ ] Can browse arcs and episodes
- [ ] Videos load and play
- [ ] Quality selector works (if available)

---

## 💡 Pro Tips

1. **Keep both terminals open** - You need both frontend and backend running

2. **Use Random Episode** - Great way to discover episodes

3. **Enable Redis** - Significantly improves performance

4. **Check logs** - Backend terminal shows scraping progress

5. **Browser DevTools** - Use F12 to debug issues

---

## 🆘 Need Help?

### Check Logs

**Backend logs:** Check the terminal running `python main.py`

**Frontend logs:** Open browser DevTools (F12) → Console

### Common Commands

```bash
# Check if ports are in use
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Restart backend
cd backend && python main.py

# Restart frontend
cd frontend && npm run dev
```

---

## 📞 Contact

If you encounter issues:
1. Check the terminal outputs for errors
2. Review this guide
3. Check `backend/README.md` for detailed backend info
4. Check `BACKEND_GUIDE.md` for implementation details

---

**Enjoy watching One Piece! 🏴‍☠️⚓**

