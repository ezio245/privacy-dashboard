const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const ps = require('ps-node'); // Or another system monitoring library
const WebSocket = require('ws');

const app = express();
const router = express.Router();

// Server Configuration
app.use(cors());
app.use(express.json());

// Mock Users Table (replace with DB)
const users = {
  'admin': 'securepas$word123'
};

// JWT Secret
const SECRET = 'your-secure-secret-key';

app.use('/api', router);

// Auth Routes
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// protected Routes
router.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('')[1];
    var decoded = await jwt.verify(token, SECRET);
    req.user = decoded;
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// System Performance Routes
router.get('/performance', (req, res) => {
  const metrics = getSystemMetrics(); // Implement ps-node calls
  res.json(metrics);
});

// WebSocket Implementation (Real-Time Monitoring)
const wss = new WebSocket.Server({ server: app });

wss.on('connection', (ws) => {
  console.log("Client Connected");
  ws.send(JSON.stringify(getSystemMetrics()));
  setInterval(() => {
    ws.send(JSON.stringify(getSystemMetrics()));
  }, 1000);
  ws.on('close', () => console.log("Client Disconnected"));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Helper Function for Metrics
function getSystemMetrics() {
  return {
    cpu: process.cpuUsage(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    pid: process.pid,
    hostname: require('os').hostname()
  };
}

// Development Server
app.set('port', process.env.PORT || 3001);
const server = app.listen(app.get('port'), () => console.log(`Server running on port ${server.address().port}`));

