const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = nodeCrypto;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = nodeCrypto;
}

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, SiteStats, mongoose, getDbError } = require('./database');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

const JWT_SECRET = 'cinewatch_super_secret_key_123';

// ----------------------------------------------------
// MIDDLEWARE: Verify JWT
// ----------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// 0. DB STATUS ENDPOINT
// ----------------------------------------------------
app.get('/api/db-status', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    state: states[state] || state,
    readyState: state,
    dbError: getDbError()
  });
});

// ----------------------------------------------------
// 1. SIGNUP ENDPOINT
// ----------------------------------------------------
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const emailPrefix = cleanEmail.split('@')[0].toLowerCase();
  const cleanUsername = cleanName.replace(/\s+/g, '').toLowerCase();

  try {
    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername },
        { username: emailPrefix }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: cleanName,
      username: cleanUsername || emailPrefix,
      email: cleanEmail,
      password_hash
    });

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User created successfully', 
      token, 
      user: { 
        id: newUser._id.toString(), 
        name: newUser.name, 
        username: newUser.username, 
        email: newUser.email, 
        avatar: newUser.avatar || '🎬',
        createdAt: newUser.created_at ? newUser.created_at.toISOString() : new Date().toISOString()
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal server error: ${err.message || err}` });
  }
});

// ----------------------------------------------------
// 2. LOGIN ENDPOINT
// ----------------------------------------------------
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username or Email and password are required.' });

  const rawInput = username.trim();
  const normalizedInput = rawInput.toLowerCase();
  const noSpacesInput = rawInput.replace(/\s+/g, '').toLowerCase();
  const escapedInput = rawInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nameRegex = new RegExp(`^${escapedInput}$`, 'i');

  try {
    // Find user by username, email, or display name
    const user = await User.findOne({
      $or: [
        { email: normalizedInput },
        { username: normalizedInput },
        { username: noSpacesInput },
        { name: nameRegex }
      ]
    });

    if (!user) return res.status(400).json({ error: 'No account found with this username or email.' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Incorrect password. Please try again.' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        username: user.username, 
        email: user.email, 
        avatar: user.avatar || '🎬', 
        createdAt: user.created_at ? user.created_at.toISOString() : new Date().toISOString()
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Database error: ${err.message || err}` });
  }
});

// ----------------------------------------------------
// 3. GET CURRENT USER PROFILE & DATA
// ----------------------------------------------------
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    res.json({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || '🎬',
      createdAt: user.created_at ? user.created_at.toISOString() : new Date().toISOString(),
      favorites: user.favorites || [],
      continueWatching: user.continueWatching || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 4. UPDATE PROFILE (Avatar / Display Name)
// ----------------------------------------------------
app.post('/api/update-profile', authenticateToken, async (req, res) => {
  const { name, avatar } = req.body;
  const updates = {};
  if (name && typeof name === 'string' && name.trim()) {
    updates.name = name.trim();
  }
  if (avatar && typeof avatar === 'string') {
    updates.avatar = avatar;
  }

  try {
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || '🎬',
        createdAt: user.created_at ? user.created_at.toISOString() : new Date().toISOString()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 5. UNIFIED DATA SYNC (Favorites + Continue Watching)
// ----------------------------------------------------
app.post('/api/sync', authenticateToken, async (req, res) => {
  const { favorites, continueWatching } = req.body;
  const updates = {};
  if (Array.isArray(favorites)) updates.favorites = favorites;
  if (continueWatching && typeof continueWatching === 'object') updates.continueWatching = continueWatching;

  try {
    await User.findByIdAndUpdate(req.user.id, updates);
    res.json({ message: 'Data synced successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// Individual sync fallbacks
app.post('/api/sync/favorites', authenticateToken, async (req, res) => {
  const { favorites } = req.body;
  if (!Array.isArray(favorites)) return res.status(400).json({ error: 'Invalid data format.' });

  try {
    await User.findByIdAndUpdate(req.user.id, { favorites });
    res.json({ message: 'Favorites synced to cloud.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

app.post('/api/sync/continue_watching', authenticateToken, async (req, res) => {
  const { continueWatching } = req.body;
  if (typeof continueWatching !== 'object') return res.status(400).json({ error: 'Invalid data format.' });

  try {
    await User.findByIdAndUpdate(req.user.id, { continueWatching });
    res.json({ message: 'Continue watching synced to cloud.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 6. UPDATE PASSWORD
// ----------------------------------------------------
app.post('/api/update-password', authenticateToken, async (req, res) => {
  const currentPassword = req.body.currentPassword || req.body.oldPassword;
  const newPassword = req.body.newPassword;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both fields are required.' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Current password is incorrect.' });

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    user.password_hash = newHash;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 7. PASSWORD RESET REQUEST
// ----------------------------------------------------
app.post('/api/reset-password', async (req, res) => {
  const { email, username } = req.body;
  const query = (email || username || '').trim().toLowerCase();
  if (!query) return res.status(400).json({ error: 'Email or username is required.' });

  try {
    const user = await User.findOne({
      $or: [{ email: query }, { username: query }]
    });
    if (!user) return res.status(400).json({ error: 'No account found with this email or username.' });

    res.json({ message: 'A password reset link has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 8. ANALYTICS: TRACK VISIT & GET STATS
// ----------------------------------------------------
app.post('/api/track-visit', async (req, res) => {
  try {
    const stats = await SiteStats.findOneAndUpdate(
      { metricName: 'global' },
      { $inc: { totalViews: 1 }, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, totalViews: stats.totalViews });
  } catch (err) {
    console.error('Error tracking visit:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await SiteStats.findOne({ metricName: 'global' });
    const totalViews = stats ? stats.totalViews : 0;
    
    // We can also get total users just to show on dashboard
    const totalUsers = await User.countDocuments();

    res.json({ totalViews, totalUsers });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// Root Health Check (Render Proxy binding fix)
app.get('/', (req, res) => {
  res.send('CineWatch API is running! Version 2');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CineWatch custom backend running on port ${PORT}`);
});
