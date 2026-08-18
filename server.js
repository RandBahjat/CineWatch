const nodeCrypto = require('crypto');
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = nodeCrypto;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = nodeCrypto;
}

const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const crypto = require('crypto');
const { User, SiteStats, Media, mongoose, getDbError } = require('./database');

const app = express();

// Serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(__dirname));

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

function isAdmin(req, res, next) {
  // Check if the authenticated user is Flame-_-2005
  if (!req.user || !req.user.username || req.user.username.toLowerCase() !== 'flame-_-2005') {
    return res.status(403).json({ error: 'Access denied. This action is restricted to the site administrator.' });
  }
  next();
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
// POST forgot password (generates token and sends email)
app.post('/api/forgot-password', async (req, res) => {
  const { email, username } = req.body;
  const query = (email || username || '').trim().toLowerCase();
  if (!query) return res.status(400).json({ error: 'Email or username is required.' });

  try {
    const user = await User.findOne({
      $or: [{ email: query }, { username: query }]
    });
    if (!user) return res.status(400).json({ error: 'No account found with this email or username.' });
    if (!user.email) return res.status(400).json({ error: 'No email address is associated with this account.' });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email via Resend API
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured on Render.');
      return res.status(500).json({ error: 'Email service is not configured. Please contact the administrator.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetUrl = `https://randbahjat.github.io/CineWatch/reset-password.html?token=${resetToken}`;

    const { error: emailError } = await resend.emails.send({
      from: 'CineWatch <onboarding@resend.dev>',
      to: process.env.EMAIL_USER || user.email,
      subject: 'CineWatch Password Reset',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0b0c10;color:#fff;border-radius:8px;">
          <h2 style="color:#66fcf1;">🎬 CineWatch — Password Reset</h2>
          <p>You requested a password reset for your account <strong>${user.username}</strong>.</p>
          <p>Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#66fcf1;color:#0b0c10;text-decoration:none;border-radius:4px;font-weight:bold;">Reset Password</a>
          <p style="color:#aaa;font-size:0.85rem;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return res.status(500).json({ error: `Failed to send email: ${emailError.message}` });
    }

    res.json({ message: 'A password reset link has been sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err.message || err);
    res.status(500).json({ error: `Failed to send email: ${err.message || 'Unknown error'}` });
  }
});

// POST confirm password reset
app.post('/api/reset-password-confirm', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required.' });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset. You may now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 8. ANALYTICS: TRACK VISIT & GET STATS
// ----------------------------------------------------
app.post('/api/page-load', async (req, res) => {
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

// ----------------------------------------------------
// 9. MEDIA CRUD (Movies & Series)
// ----------------------------------------------------

// GET all media (public)
app.get('/api/media', async (req, res) => {
  try {
    const media = await Media.find({}).sort({ order: 1, createdAt: 1 });
    res.json(media);
  } catch (err) {
    console.error('Error fetching media:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// GET single media item
app.get('/api/media/:id', async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
});

// PUT bulk reorder media (admin only)
app.put('/api/media/reorder', authenticateToken, isAdmin, async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds must be an array.' });
  try {
    const updates = orderedIds.map((id, index) =>
      Media.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updates);
    res.json({ message: 'Order saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order.' });
  }
});

// POST new media item (protected, admin only)
app.post('/api/media', authenticateToken, isAdmin, async (req, res) => {
  try {
    const item = await Media.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating media:', err);
    res.status(500).json({ error: `Database error: ${err.message}` });
  }
});

// PUT update media item (protected, admin only)
app.put('/api/media/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const item = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error updating media:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// DELETE media item (protected, admin only)
app.delete('/api/media/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const item = await Media.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    console.error('Error deleting media:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});
// Default route fallback to serve index.html (for SPA routing if needed)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CineWatch custom backend running on port ${PORT}`);
});
