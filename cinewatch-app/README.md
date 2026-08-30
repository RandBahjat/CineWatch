# 🎬 CineWatch Mobile & Desktop App

A modern, standalone mobile and desktop application for streaming movies, series, and anime with dark glassmorphism styling, bottom navigation, live TV, and quick-play modal video players.

---

## 📱 Features

1. **Brand-New Mobile & Desktop UI**:
   - Netflix/Apple TV style dark glassmorphism interface.
   - Ambient background glow effects.
   - Fixed bottom navigation bar with 5 tabs: **Home, Explore, Live TV, Anime, Watchlist**.

2. **Hero Carousel & Shelves**:
   - Swipeable trending movie banner with auto-slide.
   - Touch-friendly horizontal scrolling shelves for Movies, Series, Anime, and Kurdish Dubbed.

3. **Built-In Video Player**:
   - Quick-play video modal with all 6 streaming servers (AutoEmbed, VidLink, VidSrc, ZXC, EmbVid).

---

## 🚀 How to Run & Preview

### 1. Web Preview (Browser / Phone):
Open your terminal inside the project folder:
```powershell
npx serve .
```
Open the provided URL (e.g. `http://localhost:3000/cinewatch-app/`) in your browser or phone!

### 2. Windows Desktop App (Electron):
```powershell
cd cinewatch-app
npm install
npm start
```

### 3. Build Windows `.exe` Installer:
```powershell
npm run build:win
```
*(Produces a standalone `CineWatch-Setup.exe` inside `cinewatch-app/dist/`)*
