# 🚀 Quick Start Guide

Get the One Piece Viewer up and running in 5 minutes!

## Prerequisites Check

Make sure you have Node.js installed:
```bash
node --version  # Should be v16 or higher
npm --version   # Should be v8 or higher
```

Don't have Node.js? Download it from [nodejs.org](https://nodejs.org/)

## Installation Steps

### 1. Navigate to the project
```bash
cd one-piece-viewer/frontend
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open your browser
The app will automatically open, or go to: **http://localhost:5173**

## What You'll See

1. **Home Page** - Browse all One Piece arcs organized by saga
2. **Random Episode Button** - Click to watch a random episode
3. **Search Bar** - Search by episode number, arc name, or saga
4. **Arc Cards** - Click any arc to see all episodes in that arc
5. **Video Player** - Currently a placeholder (see below)

## Current Status

✅ **Working:**
- Arc browsing and navigation
- Episode search
- Random episode selection
- Beautiful, responsive UI
- All episode data (1100+ episodes)

⚠️ **Not Yet Implemented:**
- Video playback (requires backend)
- Video player shows placeholder

## Next Steps

### Option 1: Just Browse (No Backend Needed)
You can use the app to:
- Browse all One Piece arcs
- Find episodes by number or name
- Plan your watch order
- Use as a reference guide

### Option 2: Implement Video Playback
To enable actual video playback, you need to implement the backend scraper.

See `BACKEND_GUIDE.md` for detailed instructions.

**Quick Backend Setup:**
```bash
# Install Python dependencies
pip install fastapi uvicorn redis requests beautifulsoup4

# Create backend (follow BACKEND_GUIDE.md)
cd ../backend
python main.py

# Backend will run on http://localhost:8000
```

## Features Guide

### 🎲 Random Episode
- Click the "Watch Random Episode" button on the home page
- Instantly loads a random episode from 1-1100+

### 📚 Browse by Arc
- Scroll through all sagas (East Blue, Alabasta, Wano, etc.)
- Click any arc card to see all episodes
- Each arc shows episode count and range

### 🔍 Search
- **By Episode Number:** Type "45" to go to episode 45
- **By Arc Name:** Type "Marineford" to find all matching episodes
- **By Saga:** Type "Summit War" to see episodes from that saga

### 🎬 Watch Page
- Previous/Next episode buttons
- Random episode button
- More episodes from the same arc
- Episode information and arc context

## Keyboard Shortcuts (Planned)

- `Space` - Play/Pause (when video is implemented)
- `→` - Next episode
- `←` - Previous episode
- `R` - Random episode
- `/` - Focus search

## Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  'op-orange': '#YOUR_COLOR',  // Main accent color
  'op-dark': '#YOUR_COLOR',    // Dark background
}
```

### Add More Episodes
Edit `frontend/src/data/onePieceData.js` to add new episodes and arcs.

## Troubleshooting

### Port Already in Use
If port 5173 is taken:
```bash
npm run dev -- --port 3000
```

### Dependencies Not Installing
Clear npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Working
Restart the dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

### Page Not Loading
1. Check the terminal for errors
2. Make sure you're in the `frontend` directory
3. Try clearing browser cache (Ctrl+Shift+R)

## Building for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

To preview the production build:
```bash
npm run preview
```

## Project Structure Reference

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Home, Watch, etc.)
│   ├── data/           # Episode and arc data
│   ├── App.jsx         # Main app with routing
│   └── index.css       # Global styles
├── public/             # Static assets
└── package.json        # Dependencies
```

## Need Help?

- 📖 Read the full `README.md`
- 🔧 Backend setup: `BACKEND_GUIDE.md`
- 🐛 Found a bug? Check the console (F12)

## What's Next?

1. **Explore the app** - Browse all arcs and episodes
2. **Customize it** - Change colors, add features
3. **Implement backend** - Follow `BACKEND_GUIDE.md` for video playback
4. **Add features:**
   - User authentication
   - Watch history
   - Bookmarks
   - Episode ratings
   - Character information

---

**Enjoy exploring the Grand Line! ⚓🏴‍☠️**

