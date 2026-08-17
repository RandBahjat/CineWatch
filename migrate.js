/**
 * migrate.js — One-time script to insert all movies/series from movie.js into MongoDB.
 * Run with: node migrate.js
 * Safe to run multiple times — it checks for duplicates first.
 */

const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined') globalThis.crypto = nodeCrypto;
if (typeof global.crypto === 'undefined') global.crypto = nodeCrypto;

const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

async function run() {
  const rawMovieJs = fs.readFileSync(path.join(__dirname, 'movie.js'), 'utf8');

  // Extract the MOVIES array from movie.js by finding its boundaries
  const startIdx = rawMovieJs.indexOf('const MOVIES = [');
  if (startIdx === -1) throw new Error('Could not find MOVIES array in movie.js');

  // Find the matching closing bracket by counting brackets
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let endIdx = -1;
  const arrayStart = rawMovieJs.indexOf('[', startIdx);

  for (let i = arrayStart; i < rawMovieJs.length; i++) {
    const ch = rawMovieJs[i];
    if (inString) {
      if (ch === stringChar && rawMovieJs[i - 1] !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = true; stringChar = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }

  if (endIdx === -1) throw new Error('Could not find end of MOVIES array');

  const arrayStr = rawMovieJs.slice(arrayStart, endIdx + 1);

  // Safely evaluate the array
  let movies;
  try {
    movies = eval(arrayStr);
  } catch (e) {
    throw new Error('Failed to parse MOVIES array: ' + e.message);
  }

  console.log(`Found ${movies.length} titles in movie.js`);

  // Connect to MongoDB
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('\nERROR: MONGO_URI environment variable is not set.');
    console.error('Run: $env:MONGO_URI="your-connection-string"; node migrate.js\n');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Define schema inline
  const mediaSchema = new mongoose.Schema({
    title:    String, type: String, year: Number, rating: Number,
    age:      String, duration: String, genres: [String],
    poster:   String, backdrop: String, videoUrl: String,
    overview: String, director: String, cast: [String],
    trending: Boolean, featured: Boolean, is4k: Boolean,
    seasons:  Array, createdAt: { type: Date, default: Date.now }
  });
  const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

  // Check if already migrated
  const existingCount = await Media.countDocuments();
  if (existingCount > 0) {
    console.log(`\nDatabase already has ${existingCount} titles.`);
    console.log('Skipping migration to avoid duplicates.');
    console.log('If you want to re-migrate, manually clear the Media collection first.');
    await mongoose.disconnect();
    return;
  }

  // Clean data and insert
  const cleaned = movies.map(m => ({
    title:    m.title || 'Untitled',
    type:     m.type || (m.seasons && m.seasons.length ? 'TV Show' : 'Movie'),
    year:     m.year || null,
    rating:   m.rating || null,
    age:      m.age || null,
    duration: m.duration || null,
    genres:   Array.isArray(m.genres) ? m.genres : [],
    poster:   m.poster || null,
    backdrop: m.backdrop || null,
    videoUrl: m.videoUrl || m.embedId || null,
    overview: m.overview || null,
    director: m.director || null,
    cast:     Array.isArray(m.cast) ? m.cast.flat() : [],
    trending: !!m.trending,
    featured: !!m.featured,
    is4k:     !!m.is4k,
    seasons:  Array.isArray(m.seasons) ? m.seasons : [],
  }));

  const result = await Media.insertMany(cleaned);
  console.log(`\nSuccessfully migrated ${result.length} titles to MongoDB!`);
  await mongoose.disconnect();
  console.log('Done! You can now delete migrate.js.');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
