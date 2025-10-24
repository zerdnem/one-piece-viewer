# Movies & Specials Feature

## Overview
The One Piece Viewer now supports watching **Movies**, **TV Specials**, and **OVAs** in addition to regular episodes!

## What's New

### 🎬 Movies (15 Total)
All One Piece theatrical releases are now available:
- Classic movies (1-7): The Movie, Clockwork Island, Chopper's Kingdom, etc.
- Recap movies (8-9): Episode of Alabasta, Episode of Chopper Plus
- Modern featured films (10-15):
  - **Strong World** (Written by Oda!)
  - **Film Z**
  - **Film Gold**
  - **Stampede**
  - **Film Red** (Latest!)

### 📺 TV Specials & OVAs (10 Total)
Special episodes and original video animations:
- **Romance Dawn Story** - Original pilot
- **Episode of** specials (Nami, Luffy, Merry, Sabo, East Blue, Skypiea)
- **3D2Y** - Luffy's training during the timeskip
- **Heart of Gold** - Legendary treasure adventure
- **Defeat Him! The Pirate Ganzack** - 1998 OVA (earliest anime production)

## Features

### Frontend
- **New MediaCard Component**: Displays movies and specials with featured badges
- **Dedicated Sections**: Movies and specials have their own browsing sections on the home page
- **Updated Stats**: Dashboard now shows counts for Episodes, Movies, Specials, Arcs, and Sagas
- **Seamless Navigation**: Previous/Next buttons work for movies and specials
- **Contextual UI**: Different icons and colors for movies (🎬) vs specials (📺)

### Backend
- **New API Endpoint**: `/api/content/{content_id}/video`
  - Supports episode numbers: `1`, `2`, `1000`, etc.
  - Supports movies: `movie-1`, `movie-15`, etc.
  - Supports specials: `special-1`, `special-10`, etc.
- **Intelligent Mapping**: Movie and special IDs are mapped to searchable names
- **Separate Caching**: Movies and specials have their own cache keys
- **Backward Compatible**: Old `/api/episode/{episode_num}/video` endpoint still works

## URL Structure

### Watching Content
- Episodes: `/watch/1` to `/watch/1100+`
- Movies: `/watch/movie-1` to `/watch/movie-15`
- Specials: `/watch/special-1` to `/watch/special-10`

### Examples
- Watch Strong World: `http://localhost:5173/watch/movie-10`
- Watch Film Red: `http://localhost:5173/watch/movie-15`
- Watch 3D2Y: `http://localhost:5173/watch/special-5`
- Watch Romance Dawn: `http://localhost:5173/watch/special-1`

## Technical Details

### Data Structure
All movies and specials are defined in `frontend/src/data/onePieceData.js`:

```javascript
export const onePieceMovies = [
  {
    id: 1,
    title: "One Piece: The Movie",
    year: 2000,
    description: "...",
    color: "from-red-600 to-orange-600",
    duration: "51 min",
    featured: false  // true for major films
  },
  // ... more movies
];

export const onePieceSpecials = [
  {
    id: 1,
    title: "Romance Dawn Story",
    year: 2008,
    type: "OVA",
    description: "...",
    color: "from-red-500 to-orange-500",
    duration: "34 min"
  },
  // ... more specials
];
```

### Skip Intro/Outro
- **Episodes**: Full skip intro/outro support via AniSkip API
- **Movies & Specials**: Skip features disabled (no consistent intro/outro patterns)

### Video Player
- Automatically detects content type from URL
- Shows appropriate loading messages
- Displays different badges and metadata based on content type
- Navigation buttons adapt to content type (Next Movie, Next Special, etc.)

## Backend Movie/Special Mapping

The backend intelligently maps IDs to searchable names:

### Movies
```python
movie_names = {
    10: "One Piece Strong World",
    12: "One Piece Film Z",
    13: "One Piece Film Gold",
    14: "One Piece Stampede",
    15: "One Piece Film Red"
    # ... etc
}
```

### Specials
```python
special_names = {
    5: "One Piece 3D2Y",
    7: "One Piece Heart of Gold",
    8: "One Piece Episode of East Blue",
    # ... etc
}
```

## Future Enhancements

Potential improvements:
1. Add movie trailers and promotional images
2. Implement watch history for movies/specials
3. Add recommendations (watch order, related content)
4. Filter/sort movies by year, rating, or popularity
5. Add detailed cast and crew information
6. Include theatrical release dates and box office data

## Usage

Simply browse to the home page and scroll down to see:
1. **🎬 Movies** section with all theatrical releases
2. **📺 TV Specials & OVAs** section with special episodes
3. **Browse by Arc** section with regular episodes

Click any movie or special to start watching immediately!

---

**Note**: Video availability depends on scraper sources. Some movies and specials may have limited availability depending on the streaming sources.

