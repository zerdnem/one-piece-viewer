# 🏴‍☠️ One Piece Viewer

A modern, beautiful web application to watch One Piece episodes organized by arc, with random episode selection and search functionality.

## ✨ Features

- **Browse by Arc** - All One Piece episodes organized by saga and arc
- **Random Episode** - Feeling adventurous? Watch a random episode
- **Search** - Search by episode number, arc name, or saga
- **Modern UI** - Beautiful, responsive design with Tailwind CSS
- **Episode Navigation** - Easy navigation between episodes
- **Comprehensive Data** - Over 1100+ episodes catalogued with arc information

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client (ready for backend integration)

### Backend
- **FastAPI** - Python web framework  
- **Redis** - Video URL caching (optional)
- **Video Scraper** - Based on ani-cli logic (✅ Implemented!)
- **Cloudscraper** - Bypass protection
- **BeautifulSoup4** - HTML parsing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn
- Redis (optional, for caching)

### Quick Start

**See `STARTUP_GUIDE.md` for detailed instructions.**

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # if first time
npm run dev
```

**Open:** `http://localhost:5173`

## 🎯 Usage

### Browse by Arc
- Navigate through all One Piece sagas and arcs
- Click on any arc to see all episodes in that arc
- View episode ranges and descriptions

### Random Episode
- Click the "Watch Random Episode" button on the home page
- Instantly loads a random episode from the entire series

### Search Episodes
- Use the search bar to find episodes by:
  - Episode number (e.g., "1000")
  - Arc name (e.g., "Wano")
  - Saga name (e.g., "Summit War")

### Watch Episodes
- Click on any episode to go to the watch page
- Navigate between previous/next episodes
- Access more episodes from the same arc

## 📊 Data Structure

The app includes comprehensive data for:
- ✅ 11 Major Sagas
- ✅ 32+ Story Arcs
- ✅ 1100+ Episodes with arc categorization
- ✅ Episode titles for major episodes
- ✅ Arc descriptions

## 🎬 Video Playback (✅ Implemented!)

The backend video scraper is **fully implemented** and working!

### Features
- ✅ Video URL scraping from streaming sites
- ✅ Multiple quality options
- ✅ Redis caching for performance
- ✅ Fallback provider support
- ✅ HTML5 video player
- ✅ Quality selector in UI

### How It Works
1. Frontend requests episode from backend API
2. Backend scrapes video URL from providers (GogoAnime, etc.)
3. URL is cached in Redis for fast subsequent access
4. Frontend plays video using HTML5 player

See `STARTUP_GUIDE.md` for setup instructions and `backend/README.md` for technical details.

## 🗂️ Project Structure

```
one-piece-viewer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # App header
│   │   │   ├── ArcCard.jsx         # Arc display card
│   │   │   ├── EpisodeCard.jsx     # Episode list item
│   │   │   ├── SearchBar.jsx       # Search input
│   │   │   └── VideoPlayer.jsx     # Video player (placeholder)
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── ArcView.jsx         # Arc episode list
│   │   │   └── Watch.jsx           # Video player page
│   │   ├── data/
│   │   │   └── onePieceData.js     # All arc and episode data
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- `op-orange`: #FF6B35 (One Piece orange)
- `op-blue`: #004E89 (Ocean blue)
- `op-dark`: #1A1A2E (Dark background)
- `op-light`: #F7F7FF (Light text)

### Adding More Episodes
Update `src/data/onePieceData.js` to add new episodes and arcs:

```javascript
{
  id: 33,
  name: "New Arc Name",
  episodes: [1101, 1102, 1103, ...],
  description: "Arc description"
}
```

## 🚧 Roadmap

- [ ] Implement backend video scraper
- [ ] Add video quality selection
- [ ] User authentication and watch history
- [ ] Bookmarks and favorites
- [ ] Episode ratings and reviews
- [ ] Mobile app (React Native)
- [ ] Subtitle support
- [ ] Auto-play next episode
- [ ] Filler episode indicators
- [ ] Character and crew information

## ⚖️ Legal Notice

This application is for **educational purposes only**. 

- The app currently does NOT include any video content or links
- Video integration would require either:
  - Official licensing agreements
  - User-provided legal sources
  - Integration with licensed streaming platforms

Users are responsible for ensuring they have legal rights to access any content they view.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is for educational purposes. One Piece is © Eiichiro Oda/Shueisha, Toei Animation.

## 🙏 Acknowledgments

- One Piece created by Eiichiro Oda
- Arc data compiled from One Piece Wiki
- Inspired by ani-cli
- Built with love for the Straw Hat crew

---

**Set sail on the Grand Line! ⚓**

