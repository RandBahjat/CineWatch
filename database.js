const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = nodeCrypto;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = nodeCrypto;
}

const mongoose = require('mongoose');

// The connection string provided by the user
const MONGO_URI = "mongodb+srv://randbahjat88_db_user:ggiOfXYMs3vqxicp@cluster0.km7xzpk.mongodb.net/cinewatch?retryWrites=true&w=majority&appName=Cluster0";

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
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Define the SiteStats schema for global site metrics
const siteStatsSchema = new mongoose.Schema({
  metricName: { type: String, required: true, unique: true }, // e.g., 'global'
  totalViews: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);

module.exports = { User, SiteStats, mongoose, getDbError: () => dbError };
