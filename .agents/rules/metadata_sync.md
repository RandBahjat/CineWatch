# Sync Series and Anime Metadata Automatically

When the user asks to add a new TV show, Series, or Anime to `movies-data.js`, `series-data.js`, or `anime-data.js`:

1. **Do not guess or assume episode counts and season structures.**
2. **You MUST automatically query an official metadata source** (such as TMDB or TVMaze APIs) to fetch the exact season structure, episode counts, and correct episode titles.
3. Make sure the generated JSON exactly mirrors the official TMDB/TVMaze season and episode counts so that video streaming servers (like `vidsrc.sbs`) can properly link and play the exact episode chosen.
4. **Do not create temporary files** on the disk to perform data fetches. Instead, execute inline scripts (e.g., via `node -e "..."` in powershell) to pipe data or manipulate the JSON purely in memory.
5. If the user adds a series manually, cross-reference the season and episode count with an official database and automatically fix them if they are misaligned.
