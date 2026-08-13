const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiters have been permanently removed as requested

const JWT_SECRET = 'cinewatch_super_secret_key_123'; // In production, use environment variables

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// 1. SIGNUP ENDPOINT
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

  // For this implementation, we will use the user's name as their username (lowercase, no spaces)
  // In a real app, you might ask for a separate username field.
  const username = name.replace(/\s+/g, '').toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      `INSERT INTO users (name, username, email, password_hash) VALUES (?, ?, ?, ?)`,
      [name, username, email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username or email already exists.' });
          }
          return res.status(500).json({ error: 'Database error.', details: err.message });
        }
        
        const userId = this.lastID;
        // Initialize empty user data (favorites/history)
        db.run(`INSERT INTO user_data (user_id) VALUES (?)`, [userId], (err2) => {
          if (err2) console.error(err2);
          
          // Generate JWT
          const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
          res.status(201).json({ message: 'User created successfully', token, user: { id: userId, name, username, email } });
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2. LOGIN ENDPOINT (Username Only)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });

  const queryUsername = username.replace(/\s+/g, '').toLowerCase();

  db.get(`SELECT * FROM users WHERE username = ?`, [queryUsername], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!user) return res.status(400).json({ error: 'auth/user-not-found' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'auth/wrong-password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, username: user.username, email: user.email, avatar: user.avatar } });
  });
});

// 3. GET CURRENT USER PROFILE (Requires Token)
app.get('/api/me', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  db.get(`
    SELECT u.id, u.name, u.username, u.email, u.avatar, d.favorites, d.continue_watching 
    FROM users u 
    LEFT JOIN user_data d ON u.id = d.user_id 
    WHERE u.id = ?
  `, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(404).json({ error: 'User not found.' });
    
    res.json({
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      avatar: row.avatar,
      favorites: JSON.parse(row.favorites || '[]'),
      continueWatching: JSON.parse(row.continue_watching || '{}')
    });
  });
});

// 4. SYNC USER DATA (Favorites & History)
app.post('/api/sync', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { favorites, continueWatching } = req.body;
  
  db.run(`
    UPDATE user_data 
    SET favorites = ?, continue_watching = ? 
    WHERE user_id = ?
  `, [JSON.stringify(favorites || []), JSON.stringify(continueWatching || {}), userId], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to sync data.' });
    res.json({ message: 'Data synced successfully.' });
  });
});

// 5. UPDATE PROFILE
app.post('/api/update-profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, avatar } = req.body;
  
  if (name) {
    db.run('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
  }
  if (avatar) {
    db.run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, userId]);
  }
  res.json({ message: 'Profile updated' });
});

// 6. UPDATE PASSWORD
app.post('/api/update-password', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  db.get(`SELECT password_hash FROM users WHERE id = ?`, [userId], async (err, user) => {
    if (err || !user) return res.status(500).json({ error: 'Database error.' });

    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Incorrect current password.' });

    const newHashed = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHashed, userId], (err2) => {
      if (err2) return res.status(500).json({ error: 'Failed to update password.' });
      res.json({ success: true, message: 'Password updated successfully' });
    });
  });
});

// 7. REQUEST PASSWORD RESET
app.post('/api/reset-password', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required.' });

  const queryUsername = username.replace(/\s+/g, '').toLowerCase();

  db.get(`SELECT id, email FROM users WHERE username = ?`, [queryUsername], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!user || !user.email) return res.status(400).json({ error: 'auth/user-not-found' });

    // Generate a temporary reset token (expires in 15 mins)
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:3000/api/apply-reset?token=${resetToken}`;

    // Configure Nodemailer (Using Ethereal for testing, replace with Gmail in production)
    // To use real Gmail, the user must provide their email and an App Password.
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: "maribel.schuppe54@ethereal.email", // Placeholder test account
          pass: "1TqwA7T49rEwqg72jV"               // Placeholder test password
        },
      });

      let info = await transporter.sendMail({
        from: '"CineWatch Support" <support@cinewatch.local>',
        to: user.email,
        subject: "CineWatch Password Reset",
        text: `Hello, you requested a password reset. Click here to reset your password: ${resetLink}`,
        html: `<p>Hello, you requested a password reset.</p><p><a href="${resetLink}">Click here to reset your password</a></p>`,
      });

      console.log("Password reset email sent: %s", nodemailer.getTestMessageUrl(info));
      res.json({ message: 'Password reset email sent. Check your inbox.' });
    } catch (mailErr) {
      console.error(mailErr);
      res.status(500).json({ error: 'Failed to send email. Check server configuration.' });
    }
  });
});

// 8. APPLY PASSWORD RESET (Placeholder route for link click)
app.get('/api/apply-reset', (req, res) => {
  const token = req.query.token;
  if (!token) return res.send("No token provided");
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.send("Link expired or invalid.");
    res.send(`
      <h2>Reset Password</h2>
      <form method="POST" action="/api/apply-reset-submit">
        <input type="hidden" name="token" value="${token}">
        <input type="password" name="newPassword" placeholder="New Password" required minlength="6">
        <button type="submit">Update Password</button>
      </form>
    `);
  });
});

// 9. SUBMIT PASSWORD RESET
app.post('/api/apply-reset-submit', express.urlencoded({ extended: true }), (req, res) => {
  const { token, newPassword } = req.body;
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.send("Link expired or invalid.");
    const newHashed = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHashed, decoded.id], (err2) => {
      if (err2) return res.send("Failed to update password.");
      res.send("Password updated successfully! You can now log in to the website.");
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CineWatch custom backend running on http://localhost:${PORT}`);
});
