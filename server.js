const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

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
// 1. SIGNUP ENDPOINT
// ----------------------------------------------------
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

  try {
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email.split('@')[0].toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    // Use email prefix as username for now
    const username = email.split('@')[0].toLowerCase();

    const newUser = await User.create({
      name,
      username,
      email: email.toLowerCase(),
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
        createdAt: newUser.created_at.toISOString() 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------------
// 2. LOGIN ENDPOINT
// ----------------------------------------------------
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  const queryUsername = username.replace(/\s+/g, '').toLowerCase();

  try {
    // Some users might login with email
    const user = await User.findOne({
      $or: [{ username: queryUsername }, { email: queryUsername }]
    });

    if (!user) return res.status(400).json({ error: 'auth/user-not-found' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'auth/wrong-password' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        username: user.username, 
        email: user.email, 
        avatar: user.avatar, 
        createdAt: user.created_at.toISOString() 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 3. GET CURRENT USER PROFILE
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
      avatar: user.avatar,
      createdAt: user.created_at.toISOString(),
      favorites: user.favorites || [],
      continueWatching: user.continueWatching || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ----------------------------------------------------
// 4. SYNC FAVORITES
// ----------------------------------------------------
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

// ----------------------------------------------------
// 5. SYNC CONTINUE WATCHING
// ----------------------------------------------------
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
  const { currentPassword, newPassword } = req.body;
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
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'auth/user-not-found' });

    res.json({ message: 'A password reset link has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// Root Health Check (Render Proxy binding fix)
app.get('/', (req, res) => {
  res.send('CineWatch API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CineWatch custom backend running on port ${PORT}`);
});
