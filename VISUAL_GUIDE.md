# 🎨 Visual Guide - One Piece Viewer

This document describes what each page looks like and how users interact with the app.

## 🏠 Home Page

```
┌─────────────────────────────────────────────────────────────┐
│  🏴‍☠️ ONE PIECE VIEWER                                        │
│  Navigate the Grand Line - Watch by Arc or Random Episode  │
└─────────────────────────────────────────────────────────────┘

                Set Sail on the Grand Line
        Watch One Piece by arc, random episode, or search

┌─────────────────────────────────────────────────────────────┐
│  🔍  Search by episode number or title...        [Search]   │
└─────────────────────────────────────────────────────────────┘

                 ┌───────────────────────┐
                 │  🎲 Watch Random       │
                 │     Episode           │
                 └───────────────────────┘
              Feeling adventurous? Let fate choose!

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   1100+      │  │     32+      │  │     11       │
│  Episodes    │  │  Story Arcs  │  │    Sagas     │
└──────────────┘  └──────────────┘  └──────────────┘

──────────────────────────────────────────────────────────────
                    Browse by Arc
──────────────────────────────────────────────────────────────

                 ═══ East Blue Saga ═══

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Romance     │  │ Orange      │  │ Syrup       │
│ Dawn Arc    │  │ Town Arc    │  │ Village Arc │
│             │  │             │  │             │
│ Luffy       │  │ The crew    │  │ Usopp joins │
│ begins...   │  │ meets Nami  │  │ the crew    │
│             │  │             │  │             │
│ 3 Episodes  │  │ 5 Episodes  │  │ 10 Episodes │
│ Ep 1 - 3    │  │ Ep 4 - 8    │  │ Ep 9 - 18   │
└─────────────┘  └─────────────┘  └─────────────┘

[... More arcs organized by saga ...]

                ═══ Arabasta Saga ═══
                  ═══ Sky Island Saga ═══
                   ═══ Water 7 Saga ═══
                 [... and so on ...]

──────────────────────────────────────────────────────────────
           One Piece Viewer - Navigate the Grand Line
              Built with React + Tailwind CSS
```

## 📚 Arc View Page

```
← Back to All Arcs

┌─────────────────────────────────────────────────────────────┐
│  [ Alabasta Saga ]                                          │
│                                                             │
│  Alabasta Arc                                               │
│                                                             │
│  Epic battle against Crocodile and Baroque Works           │
│                                                             │
│  39 Episodes  |  Episodes 92 - 130                          │
└─────────────────────────────────────────────────────────────┘

                      All Episodes

┌──────────────────────────┐  ┌──────────────────────────┐
│ Episode 92               │  │ Episode 93               │
│ Episode Title Here       │  │ Episode Title Here       │
│ Alabasta Arc •           │  │ Alabasta Arc •           │
│ Alabasta Saga       [▶]  │  │ Alabasta Saga       [▶]  │
└──────────────────────────┘  └──────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐
│ Episode 94               │  │ Episode 95               │
│ Episode Title Here       │  │ Episode Title Here       │
│ Alabasta Arc •           │  │ Alabasta Arc •           │
│ Alabasta Saga       [▶]  │  │ Alabasta Saga       [▶]  │
└──────────────────────────┘  └──────────────────────────┘

[... All 39 episodes listed ...]
```

## 🎬 Watch Page

```
← Back to Browse

[ Alabasta Saga ]  •  Alabasta Arc

Episode 100: Rebel Warrior Vivi! The Oath of the Desert!
Epic battle against Crocodile and Baroque Works

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      🎬                                      │
│                                                             │
│               Video Player Area                             │
│                                                             │
│          (Ready for Backend Integration)                    │
│                                                             │
│  ────────────────────────────────────────────────────────  │
│  [▶] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 00:00 / 23:45        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ← Previous     │ │  🎲 Random      │ │  Next Episode → │
│    Episode      │ │    Episode      │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

──────────────────────────────────────────────────────────────
             More from Alabasta Arc
──────────────────────────────────────────────────────────────

[92] [93] [94] [95] [96] [97] [98] [99] [100] [101] [102] [103]

Click any episode to watch
```

## 🔍 Search Results View

```
                Search Results (15)              [Clear Search]

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Episode 45  │  │ Episode 100 │  │ Episode 457 │
│ Baratie Arc │  │ Alabasta    │  │ Marineford  │
│ East Blue   │  │ Arabasta    │  │ Summit War  │
└─────────────┘  └─────────────┘  └─────────────┘

[... More search results ...]
```

## 🎨 Color Palette

```
Primary Colors:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ #FF6B35  │  │ #004E89  │  │ #1A1A2E  │  │ #F7F7FF  │
│  Orange  │  │   Blue   │  │   Dark   │  │  Light   │
│ (Accent) │  │  (Ocean) │  │   (BG)   │  │  (Text)  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

Gradients:
- Background: Dark navy to black
- Cards: Dark gray to darker gray
- Buttons: Orange to red
- Hover: Border glow in orange
```

## 📱 Responsive Layouts

### Mobile View (< 768px)
```
┌──────────────┐
│    Header    │
├──────────────┤
│              │
│   Search     │
│              │
│   Random     │
│   Button     │
│              │
│  ┌────────┐  │
│  │ Arc 1  │  │  Single
│  └────────┘  │  Column
│  ┌────────┐  │
│  │ Arc 2  │  │
│  └────────┘  │
│  ┌────────┐  │
│  │ Arc 3  │  │
│  └────────┘  │
│              │
└──────────────┘
```

### Tablet View (768px - 1024px)
```
┌──────────────────────────┐
│        Header            │
├──────────────────────────┤
│                          │
│      Search Bar          │
│    Random Button         │
│                          │
│  ┌────────┐ ┌────────┐  │  Two
│  │ Arc 1  │ │ Arc 2  │  │  Columns
│  └────────┘ └────────┘  │
│  ┌────────┐ ┌────────┐  │
│  │ Arc 3  │ │ Arc 4  │  │
│  └────────┘ └────────┘  │
│                          │
└──────────────────────────┘
```

### Desktop View (> 1024px)
```
┌────────────────────────────────────────────┐
│              Header                        │
├────────────────────────────────────────────┤
│                                            │
│           Search Bar (centered)            │
│          Random Button                     │
│                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │  Three
│  │Arc 1 │ │Arc 2 │ │Arc 3 │ │Arc 4 │     │  Columns
│  └──────┘ └──────┘ └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │Arc 5 │ │Arc 6 │ │Arc 7 │ │Arc 8 │     │
│  └──────┘ └──────┘ └──────┘ └──────┘     │
│                                            │
└────────────────────────────────────────────┘
```

## 🎭 Interaction States

### Card Hover Effect
```
Normal State:          Hover State:
┌─────────────┐       ┌─────────────┐
│             │       │             │
│  Arc Name   │  →    │  Arc Name   │  (Scaled up)
│  Info       │       │  Info       │  (Orange glow)
│             │       │             │
└─────────────┘       └─────────────┘
```

### Button States
```
Normal:    [  Button  ]
Hover:     [  Button  ]  (Slightly brighter)
Active:    [  Button  ]  (Pressed effect)
Disabled:  [  Button  ]  (Grayed out)
```

### Loading State
```
┌─────────────────────┐
│                     │
│        ⟳           │  (Spinning)
│                     │
│  Loading Episode... │
│                     │
└─────────────────────┘
```

## 🎯 User Journey Examples

### Journey 1: Browse and Watch
```
1. Home Page
   ↓ Click "Alabasta Arc"
2. Arc View Page (Shows all Alabasta episodes)
   ↓ Click "Episode 100"
3. Watch Page (Video player + navigation)
```

### Journey 2: Search
```
1. Home Page
   ↓ Type "1000" in search
2. Auto-navigate to Episode 1000
   ↓
3. Watch Page for Episode 1000
```

### Journey 3: Random Discovery
```
1. Home Page
   ↓ Click "Watch Random Episode"
2. Watch Page (Random episode, e.g., Episode 547)
   ↓ Click "Random Episode" again
3. Watch Page (Different random episode, e.g., Episode 234)
```

## 🖼️ Typography Hierarchy

```
H1: ONE PIECE VIEWER (4xl, bold, white)
    ═══════════════════════════════

H2: Set Sail on the Grand Line (3xl, bold, white)
    ──────────────────────────────

H3: Browse by Arc (2xl, bold, white)
    ────────────────

H4: Saga Name (xl, bold, orange)

Body: Regular text (base, normal, gray-300)
Small: Helper text (sm, normal, gray-400)
```

## ✨ Animation Details

- **Card Hover:** Scale(1.05) + Shadow glow (300ms ease)
- **Page Transitions:** Fade in (500ms)
- **Button Press:** Scale(0.95) (150ms)
- **Loader:** Rotate 360deg (1s infinite)
- **Search:** Smooth focus transition (200ms)

---

This visual guide helps you understand the layout and flow of the application without screenshots!

