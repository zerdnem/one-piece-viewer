# 📊 Data Structure Documentation

This document explains the data structure used for organizing One Piece episodes.

## Overview

The app uses a hierarchical structure: **Sagas → Arcs → Episodes**

```
Saga (e.g., "East Blue Saga")
  └── Arc (e.g., "Baratie Arc")
      └── Episodes [19, 20, 21, ..., 30]
```

## Data Location

All data is stored in: `frontend/src/data/onePieceData.js`

## Main Data Structures

### 1. `onePieceArcs` Array

The master array containing all sagas and arcs.

```javascript
export const onePieceArcs = [
  {
    id: 1,                    // Unique saga ID
    saga: "East Blue Saga",   // Saga name
    arcs: [                   // Array of arcs in this saga
      {
        id: 1,                        // Unique arc ID
        name: "Romance Dawn Arc",     // Arc name
        episodes: [1, 2, 3],          // Array of episode numbers
        description: "Luffy begins..."  // Arc description
      },
      // ... more arcs
    ]
  },
  // ... more sagas
]
```

### 2. `allEpisodes` Array

A flattened array of all episodes with their metadata.

Automatically generated from `onePieceArcs`:

```javascript
export const allEpisodes = [
  {
    episodeNumber: 1,
    arcName: "Romance Dawn Arc",
    arcId: 1,
    sagaName: "East Blue Saga",
    description: "Luffy begins his journey..."
  },
  // ... ~1100+ episodes
]
```

**Use cases:**
- Search functionality
- Random episode selection
- Finding episode by number
- Filtering episodes by arc or saga

### 3. `episodeTitles` Object

Episode titles for notable episodes:

```javascript
export const episodeTitles = {
  1: "I'm Luffy! The Man Who Will Become Pirate King!",
  100: "Rebel Warrior Vivi! The Oath of the Desert!",
  1000: "Overwhelming Strength! The Straw Hats Come Together!",
  // ... more titles
}
```

**Use cases:**
- Display episode titles on watch page
- Search by episode title
- Episode cards

### 4. `TOTAL_EPISODES` Constant

```javascript
export const TOTAL_EPISODES = 1100;
```

Current total number of episodes (updated as series continues).

## Adding New Data

### Adding a New Episode to Existing Arc

1. Find the arc in `onePieceArcs`
2. Add the episode number to the `episodes` array:

```javascript
{
  id: 32,
  name: "Egghead Arc",
  episodes: [1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101], // Added 1101
  description: "The island of the future..."
}
```

3. Update `TOTAL_EPISODES` if needed

### Adding a New Arc

Add to the appropriate saga:

```javascript
{
  id: 11,
  saga: "Final Saga",
  arcs: [
    {
      id: 32,
      name: "Egghead Arc",
      episodes: [1086, 1087, 1088, /* ... */],
      description: "Vegapunk's island"
    },
    {
      id: 33,  // New arc
      name: "Elbaf Arc",  // New arc name
      episodes: [1120, 1121, 1122],  // New episodes
      description: "The land of giants"  // Description
    }
  ]
}
```

### Adding a New Saga

```javascript
export const onePieceArcs = [
  // ... existing sagas
  {
    id: 12,  // New ID
    saga: "New Saga Name",
    arcs: [
      {
        id: 34,
        name: "First Arc of New Saga",
        episodes: [1200, 1201, 1202],
        description: "Description here"
      }
    ]
  }
]
```

### Adding Episode Titles

For notable episodes, add to `episodeTitles`:

```javascript
export const episodeTitles = {
  // ... existing titles
  1101: "New Episode Title Here",
  1102: "Another Episode Title",
}
```

## Data Validation

### Episode Number Rules
- Must be unique
- Must be sequential within an arc
- Must be positive integers

### Arc ID Rules
- Must be unique across all arcs
- Should be sequential for easier management

### Saga ID Rules
- Must be unique
- Should be sequential

## Helper Functions

You can add utility functions to work with the data:

```javascript
// Find arc by episode number
export function findArcByEpisode(episodeNum) {
  return allEpisodes.find(ep => ep.episodeNumber === episodeNum);
}

// Get all episodes in a saga
export function getEpisodesBySaga(sagaName) {
  return allEpisodes.filter(ep => ep.sagaName === sagaName);
}

// Get episode count for an arc
export function getArcEpisodeCount(arcId) {
  for (const saga of onePieceArcs) {
    const arc = saga.arcs.find(a => a.id === arcId);
    if (arc) return arc.episodes.length;
  }
  return 0;
}

// Check if episode is in arc
export function isEpisodeInArc(episodeNum, arcId) {
  const episode = allEpisodes.find(ep => ep.episodeNumber === episodeNum);
  return episode?.arcId === arcId;
}
```

## Future Enhancements

Consider adding:

### Filler Episodes
```javascript
{
  id: 1,
  name: "Romance Dawn Arc",
  episodes: [1, 2, 3],
  fillerEpisodes: [],  // Array of filler episode numbers
  description: "..."
}
```

### Episode Air Dates
```javascript
export const episodeDates = {
  1: "1999-10-20",
  2: "1999-11-17",
  // ...
}
```

### Character Appearances
```javascript
export const characterAppearances = {
  "Monkey D. Luffy": [1, 2, 3, /* ... */],
  "Roronoa Zoro": [2, 3, 4, /* ... */],
  // ...
}
```

### Arc Images
```javascript
{
  id: 1,
  name: "Romance Dawn Arc",
  episodes: [1, 2, 3],
  image: "/images/arcs/romance-dawn.jpg",  // Arc thumbnail
  description: "..."
}
```

### Episode Types
```javascript
{
  episodeNumber: 1,
  arcName: "Romance Dawn Arc",
  arcId: 1,
  sagaName: "East Blue Saga",
  type: "canon",  // canon, filler, mixed, movie, special
  description: "..."
}
```

## Performance Considerations

### Current Implementation
- `allEpisodes` is generated once on module load
- No database queries needed
- Fast search and filtering (in-memory)

### For Large Scale
If the data grows significantly (multiple anime series), consider:

1. **Lazy Loading**: Load arcs on-demand
2. **Database**: Move to SQLite/PostgreSQL
3. **API**: Fetch data from backend
4. **Indexing**: Create search indexes
5. **Caching**: Use React Query or SWR

## Data Sources

Current data compiled from:
- [One Piece Wiki](https://onepiece.fandom.com)
- [AniList](https://anilist.co)
- Episode guides and fan wikis

## Updating Data

Recommended update frequency:
- **Weekly** when new episodes air
- **Monthly** for episode titles and descriptions
- **Per arc** for major arc completions

## Backup and Version Control

Always commit data changes with descriptive messages:

```bash
git add src/data/onePieceData.js
git commit -m "Add episodes 1101-1105 to Egghead Arc"
```

---

**Need Help?** Open an issue or check the README.md

