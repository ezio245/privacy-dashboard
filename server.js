const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// -----------------------------
// Serve Static Files
// -----------------------------
app.use(express.static(__dirname));

// In-memory user store (for demo only; use DB in prod)
const users = [];

// JWT secret
const SECRET = 'super_secret_jwt_key';

// Register
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required.' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, username, password: hash, role });
  res.json({ message: 'User registered successfully.' });
});

// Login
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
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, role: user.role });
});

// Middleware
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

function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
}

// Protected routes
app.get('/api/user-data', authenticate, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}. Your role is ${req.user.role}.` });
});

app.get('/api/admin-data', authenticate, authorize(['admin']), (req, res) => {
  res.json({ secret: 'This is admin-only data.' });
});

// Health check
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 fallback
app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
