const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = nodeCrypto;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = nodeCrypto;
}

const mongoose = require('mongoose');

// Use environment variable for the connection string to keep credentials secret
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn("WARNING: MONGO_URI environment variable is not set!");
}

let dbError = null;

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB database successfully');
  dbError = null;
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  dbError = err.message || String(err);
});

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password_hash: { type: String, required: true },
  avatar: { type: String, default: '??' },
  favorites: { type: Array, default: [] },
  continueWatching: { type: Object, default: {} },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Define the Rating schema
const ratingSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  updated_at: { type: Date, default: Date.now }
});
// Ensure a user can only rate a specific movie once
ratingSchema.index({ movieId: 1, userId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

// Define the SiteStats schema for global site metrics
const siteStatsSchema = new mongoose.Schema({
  metricName: { type: String, required: true, unique: true }, // e.g., 'global'
  totalViews: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);

// Define the DailyStats schema for tracking views per day
const dailyStatsSchema = new mongoose.Schema({
  dateStr: { type: String, required: true, unique: true }, // e.g. "2026-08-18"
  views: { type: Number, default: 0 }
});
const DailyStats = mongoose.model('DailyStats', dailyStatsSchema);

// Define the Media schema for movies and series
const mediaSchema = new mongoose.Schema({
  order: { type: Number, default: 0 },
  title:     { type: String, required: true },
  type:      { type: String, default: 'Movie' }, // 'Movie', 'TV Show', 'Series'
  year:      { type: Number },
  rating:    { type: Number },
  age:       { type: String },
  duration:  { type: String },
  genres:    { type: [String], default: [] },
  poster:    { type: String },
  backdrop:  { type: String },
  videoUrl:  { type: String },
  overview:  { type: String },
  director:  { type: String },
  cast:      { type: [String], default: [] },
  trending:  { type: Boolean, default: false },
  featured:  { type: Boolean, default: false },
  is4k:      { type: Boolean, default: false },
  seasons:   { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = { User, SiteStats, DailyStats, Media, mongoose, getDbError: () => dbError };
