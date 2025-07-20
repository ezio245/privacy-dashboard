// server.js
// PrivacyShield Authentication & API Server (Express + JWT + Bcrypt)

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// In-memory user store (for demo only; use a database in production)
const users = [];

// JWT secret (use an environment variable in production)
const SECRET = 'super_secret_jwt_key';

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required.' });
  }
  // Check if user already exists
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }
  // Hash password and store user
  const hash = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, username, password: hash, role });
  res.json({ message: 'User registered successfully.' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  // Create JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, role: user.role });
});

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Role-based access middleware
function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
}

// Example protected route
app.get('/api/user-data', authenticate, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}. Your role is ${req.user.role}.` });
});

// Example admin-only route
app.get('/api/admin-data', authenticate, authorize(['admin']), (req, res) => {
  res.json({ secret: 'This is admin-only data.' });
});

// Health check
app.get('/', (req, res) => {
  res.send('PrivacyShield Auth server is running.');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));

